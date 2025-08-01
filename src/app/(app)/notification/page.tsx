"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ArrowLeftCircle, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import { toast } from "sonner";

type Notification = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    image: string | null;
  };
};

type ApiResponse = {
  success: boolean;
  notifications: Notification[];
  message?: string;
};

export default function Notification() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUnreadCount } = useNotifications();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchAndMarkAsRead = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get<ApiResponse>("/api/notification", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n) => !n.isRead).length);

          const unreadNotifications = data.notifications.filter(
            (n) => !n.isRead
          );
          if (unreadNotifications.length > 0) {
            await axios.put("/api/notification/mark-all-read");
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, isRead: true }))
            );
            setUnreadCount(0);
          }
        } else {
          throw new Error(data.message || "Failed to fetch notifications");
        }
      } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse> | Error;
        console.error("Error:", error);

        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message);
          toast.error(
            error.response?.data?.message || "Failed to load notifications"
          );
        } else {
          setError(errorMessage.message);
          toast.error("Failed to load notifications");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndMarkAsRead();
  }, [session?.user?.id, router, setUnreadCount]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#1a1a1e] text-zinc-300">
        <p className="text-gray-400">Please sign in to view notifications</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#1a1a1e] text-zinc-300">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeftCircle className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Notifications
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 rounded-lg border bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 cursor-pointer transition"
              >
                <div className="flex items-start gap-3">
                  {notification.sender.image ? (
                    <Link href={`/profile/${notification.sender.id}`}>
                      <Image
                        src={notification.sender.image}
                        alt={notification.sender.username}
                        width={40}
                        height={40}
                        className="rounded-full border border-gray-700"
                      />
                    </Link>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white border border-gray-700">
                      {notification.sender.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/profile/${notification.sender.id}`}
                        className="font-medium text-white hover:underline"
                      >
                        {notification.sender.username}
                      </Link>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1 text-sm sm:text-base">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
