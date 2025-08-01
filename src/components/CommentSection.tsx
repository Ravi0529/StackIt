"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MentionsInput, Mention } from "react-mentions";
import mentionStyle from "@/styles/mention-style";
import { Comment } from "@/types/comment";

interface CommentSectionProps {
  answerId: string;
  questionId: string;
  onCommentAdded?: () => void;
}

export default function CommentSection({
  answerId,
  questionId,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [mentionSuggestions, setMentionSuggestions] = useState<
    { id: string; display: string }[]
  >([]);
  const { data: session } = useSession();

  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/answers/${answerId}/comments`);
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch comments");
      }
      setComments(response.data.comments);
    } catch (error) {
      let errorMessage = "Failed to load comments";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (answerId) {
      fetchComments();
      fetchMentionableUsers();
    }
  }, [answerId]);

  const fetchMentionableUsers = async () => {
    try {
      const res = await axios.get(`/api/answers/${answerId}/mentionable-users`);
      const users = res.data.users || [];
      const formatted = users.map((u: any) => ({
        id: u.id,
        display: u.username,
      }));
      setMentionSuggestions(formatted);
    } catch (err) {
      console.error("Failed to fetch mentionable users", err);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in.");
      return;
    }

    setSubmitting(true);
    const optimisticCommentId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: optimisticCommentId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: session.user.id,
      answerId,
      user: {
        id: session.user.id,
        username: session.user.username || "",
        image: session.user.image || null,
      },
      mentions: [],
    };

    try {
      setComments((prev) => [optimisticComment, ...prev]);
      setIsExpanded(false);
      setContent("");

      const mentionedUsernames = Array.from(
        content.matchAll(/@(\w+)/g),
        (match) => match[1]
      );

      const mentionedUserIds = mentionSuggestions
        .filter((u) => mentionedUsernames.includes(u.display))
        .map((u) => u.id);

      const response = await axios.post(`/api/answers/${answerId}/comments`, {
        content,
        mentionedUserIds,
      });

      if (!response.data?.comment) {
        throw new Error("Invalid response format from server");
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === optimisticCommentId
            ? {
                ...response.data.comment,
                user: {
                  id: response.data.comment.user?.id || session.user.id,
                  username:
                    response.data.comment.user?.username ||
                    session.user.username ||
                    "",
                  image:
                    response.data.comment.user?.image ||
                    session.user.image ||
                    null,
                },
                mentions: response.data.comment.mentions || [],
              }
            : comment
        )
      );
      toast.success("Comment posted!");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== optimisticCommentId)
      );
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      await axios.delete(
        `/api/answers/${answerId}/comments/${commentToDelete}`
      );
      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentToDelete)
      );
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    } finally {
      setCommentToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    if (answerId) {
      fetchComments();
    }
  }, [answerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4 text-zinc-400">
        <Loader2 className="animate-spin h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Loading comments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-red-400">
        <p>{error}</p>
        <button
          onClick={fetchComments}
          className="mt-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-white text-xs font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-zinc-800 pt-6">
      <div className="mb-6">
        {!isExpanded ? (
          <Button
            variant="ghost"
            className="text-zinc-300 hover:text-white px-3 py-1 text-sm"
            onClick={() => setIsExpanded(true)}
          >
            Add a comment
          </Button>
        ) : (
          <div className="space-y-3">
            <MentionsInput
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment..."
              style={mentionStyle}
              className="bg-zinc-900 border-zinc-700 text-white"
            >
              <Mention
                trigger="@"
                data={mentionSuggestions}
                displayTransform={(id, display) => `@${display}`}
                markup="@__display__"
              />
            </MentionsInput>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                className="bg-zinc-100 hover:bg-zinc-200 text-black text-sm px-3 py-1"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
              <Button
                variant="ghost"
                className="text-zinc-300 hover:text-white"
                onClick={() => {
                  setIsExpanded(false);
                  setContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {comments.length === 0 && !isExpanded ? (
        <p className="text-zinc-500 text-sm">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-zinc-900 border border-zinc-800 rounded-md p-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${comment.user.id}`}>
                    {comment.user.image ? (
                      <Image
                        src={comment.user.image}
                        alt={comment.user.username}
                        width={28}
                        height={28}
                        className="rounded-full border border-zinc-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs border border-zinc-700">
                        {comment.user.username[0].toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link href={`/profile/${comment.user.id}`}>
                      <span className="text-sm font-medium text-white hover:underline">
                        {comment.user.username}
                      </span>
                    </Link>
                    <p className="text-xs text-zinc-400">
                      {formatDistanceToNowStrict(new Date(comment.createdAt))}{" "}
                      ago
                    </p>
                  </div>
                </div>

                {session?.user?.id === comment.user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-800 border-zinc-700 w-40">
                      <DropdownMenuItem
                        className="text-red-500 hover:bg-red-500/10 focus:text-red-500"
                        onClick={() => {
                          setCommentToDelete(comment.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <p className="prose prose-invert max-w-none prose-sm break-words mt-2">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
