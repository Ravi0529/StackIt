"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Notification } from "@/types/notification";
import { useNotifications } from "@/context/NotificationContext";
import { usePathname } from "next/navigation";

export default function NotificationIcon() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { unreadCount, setUnreadCount } = useNotifications();
  const pathname = usePathname();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const { data } = await axios.get<Notification>(`/api/notification`, {
          params: { isRead: false },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (data.success) {
          setUnreadCount(data.notifications.length);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications");
        setUnreadCount(0);

        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config,
          });
        }
      }
    };

    fetchUnreadCount();

    if (pathname !== "/notification") {
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [session?.user?.id, pathname, setUnreadCount]);

  if (error) {
    console.error("Notification error:", error);
    return null;
  }

  return (
    <Link href="/notification" className="relative" aria-label="Notifications">
      <Bell className="h-5 w-5 text-gray-300 hover:text-white transition" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
