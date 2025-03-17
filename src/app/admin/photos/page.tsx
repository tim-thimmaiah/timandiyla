"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { PhotoFromDB } from "@/lib/photoService";

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<(PhotoFromDB & { url: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{
    id: string | null;
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
  }>({
    id: null,
    status: "idle",
    message: null,
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Get public URLs for all photos
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo: PhotoFromDB) => {
          const { data: urlData } = supabase.storage
            .from("photos")
            .getPublicUrl(photo.storage_path);

          return {
            ...photo,
            url: urlData.publicUrl,
          };
        })
      );

      setPhotos(photosWithUrls);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching photos"
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(id: string, currentApproval: boolean) {
    try {
      setUpdateStatus({
        id,
        status: "loading",
        message: null,
      });

      const { error } = await supabase
        .from("photos")
        .update({ approved: !currentApproval })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update the local state
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === id ? { ...photo, approved: !currentApproval } : photo
        )
      );

      setUpdateStatus({
        id,
        status: "success",
        message: `Photo ${
          !currentApproval ? "approved" : "unapproved"
        } successfully`,
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setUpdateStatus({
          id: null,
          status: "idle",
          message: null,
        });
      }, 3000);
    } catch (error) {
      console.error("Error updating photo approval:", error);
      setUpdateStatus({
        id,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while updating the photo",
      });
    }
  }

  async function deletePhoto(id: string, storagePath: string) {
    if (
      !confirm(
        "Are you sure you want to delete this photo? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setUpdateStatus({
        id,
        status: "loading",
        message: null,
      });

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from("photos")
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }

      // Then delete from the database
      const { error: dbError } = await supabase
        .from("photos")
        .delete()
        .eq("id", id);

      if (dbError) {
        throw dbError;
      }

      // Update the local state
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));

      setUpdateStatus({
        id,
        status: "success",
        message: "Photo deleted successfully",
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setUpdateStatus({
          id: null,
          status: "idle",
          message: null,
        });
      }, 3000);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setUpdateStatus({
        id,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the photo",
      });
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen p-8">
        <main className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-redz-700">
            Manage Photos
          </h1>

          <div className="mb-6 flex justify-between items-center">
            <Link href="/admin/rsvps" className="text-redz-700 hover:underline">
              View RSVPs
            </Link>
            <button
              onClick={fetchPhotos}
              className="px-4 py-2 bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading photos...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-8">No photos submitted yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`border rounded-lg overflow-hidden ${
                    photo.approved
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300"
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo.url}
                      alt="User submitted photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm mb-2 font-medium">
                      {new Date(photo.created_at).toLocaleString()}
                    </p>
                    <p className="mb-4">{photo.note || "No note"}</p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => toggleApproval(photo.id, photo.approved)}
                        className={`px-3 py-2 rounded-md ${
                          photo.approved
                            ? "bg-redz-100 text-redz-700 hover:bg-redz-200"
                            : "bg-redz-700 text-white hover:bg-redz-800"
                        } transition-colors`}
                        disabled={
                          updateStatus.status === "loading" &&
                          updateStatus.id === photo.id
                        }
                      >
                        {updateStatus.status === "loading" &&
                        updateStatus.id === photo.id
                          ? "Updating..."
                          : photo.approved
                          ? "Unapprove"
                          : "Approve"}
                      </button>
                      <button
                        onClick={() =>
                          deletePhoto(photo.id, photo.storage_path)
                        }
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        disabled={
                          updateStatus.status === "loading" &&
                          updateStatus.id === photo.id
                        }
                      >
                        {updateStatus.status === "loading" &&
                        updateStatus.id === photo.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                    {updateStatus.id === photo.id && updateStatus.message && (
                      <div
                        className={`mt-2 p-2 text-sm rounded-md ${
                          updateStatus.status === "error"
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {updateStatus.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link href="/" className="text-redz-700 hover:underline">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
