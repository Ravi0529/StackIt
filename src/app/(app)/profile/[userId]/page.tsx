"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeftCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import User from "../../../../../assets/user.png";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const { userId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  function stripAndTrimDescription(html: string, wordLimit: number): string {
    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(" ").filter(Boolean);
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  useEffect(() => {
    async function fetchUser() {
      let targetUserId = userId;
      if (userId === "me") {
        if (!session?.user?.id) return setLoading(false);
        targetUserId = session.user.id;
      }

      try {
        const response = await axios.get(`/api/profile/${targetUserId}`);
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          toast.error(response.data.message || "Failed to load user profile");
        }
      } catch (error) {
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      fetchUser();
    }
  }, [userId, session, status]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#1a1a1e] flex items-center justify-center z-50">
        <Loader2 className="animate-spin h-8 w-8 text-white" />
      </div>
    );
  }

  if (!user)
    return (
      <p className="p-4 text-red-500">User not found or an error occurred.</p>
    );

  return (
    <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeftCircle className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full overflow-hidden border border-zinc-600">
            {user.image ? (
              <Image
                src={user.image || User}
                alt={user.username[0]}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-700 text-white text-xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif">{user.username}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium font-serif">
            Questions ({user.questions.length})
          </h2>

          {user.questions.length === 0 ? (
            <p className="text-muted-foreground">No questions asked yet.</p>
          ) : (
            user.questions.map((q: any) => (
              <Card
                key={q.id}
                className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 cursor-pointer transition"
              >
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold font-sans hover:underline">
                    {q.title}
                  </h3>
                  <p className="text-sm text-gray-300 hidden sm:block">
                    {stripAndTrimDescription(q.description, 20)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {q.tags.map((tag: any) => (
                      <Badge
                        key={tag.tag.name}
                        className="bg-blue-600/30 text-blue-300 border border-blue-500"
                      >
                        {tag.tag.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>
                      {q._count.answers} answer{q._count.answers !== 1 && "s"}
                    </span>
                    <span>
                      Updated {formatDistanceToNow(new Date(q.updatedAt))} ago
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
