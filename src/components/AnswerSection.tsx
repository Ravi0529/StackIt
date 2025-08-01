"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Answer } from "@/types/answer";
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

interface AnswerSectionProps {
  questionId: string;
}

export default function AnswerSection({ questionId }: AnswerSectionProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState<string | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [answerToModerate, setAnswerToModerate] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchAnswers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/questions/${questionId}/answers`);
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch answers");
      }

      setAnswers(response.data.answers);
    } catch (error) {
      let errorMessage = "Failed to load answers";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching answers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in.");
      return;
    }

    setSubmitting(true);
    const optimisticAnswerId = `temp-${Date.now()}`;
    const optimisticAnswer: Answer = {
      id: optimisticAnswerId,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "pending",
      user: {
        id: session.user.id,
        username: session.user.username || "",
        image: session.user.image || null,
      },
      commentCount: 0,
      upvotes: 0,
      downvotes: 0,
    };

    try {
      if (editingAnswer) {
        const response = await axios.put(`/api/answers/${editingAnswer.id}`, {
          description,
        });

        if (!response.data?.answer) {
          throw new Error("Invalid response format from server");
        }

        setAnswers((prev) =>
          prev.map((answer) =>
            answer.id === editingAnswer.id
              ? {
                  ...response.data.answer,
                  commentCount: answer.commentCount,
                  upvotes: answer.upvotes,
                  downvotes: answer.downvotes,
                  user: answer.user,
                }
              : answer
          )
        );
        toast.success("Answer updated successfully!");
        setIsExpanded(false);
        setDescription("");
        setEditingAnswer(null);
      } else {
        setAnswers((prev) => [optimisticAnswer, ...prev]);
        setIsExpanded(false);
        setDescription("");

        const response = await axios.post(
          `/api/questions/${questionId}/answers`,
          {
            description,
            userId: session.user.id,
          }
        );

        if (!response.data?.answer) {
          throw new Error("Invalid response format from server");
        }

        setAnswers((prev) =>
          prev.map((answer) =>
            answer.id === optimisticAnswerId
              ? {
                  ...response.data.answer,
                  commentCount: response.data.answer.commentCount || 0,
                  upvotes: response.data.answer.upvotes || 0,
                  downvotes: response.data.answer.downvotes || 0,
                  user: {
                    id: response.data.answer.user?.id || session.user.id,
                    username:
                      response.data.answer.user?.username ||
                      session.user.username ||
                      "",
                    image:
                      response.data.answer.user?.image ||
                      session.user.image ||
                      null,
                  },
                }
              : answer
          )
        );
        toast.success("Answer submitted! Awaiting approval.");
      }
    } catch (error) {
      if (!editingAnswer) {
        setAnswers((prev) =>
          prev.filter((answer) => answer.id !== optimisticAnswerId)
        );
      }
      console.error(error);
      toast.error(
        editingAnswer ? "Failed to update answer" : "Failed to submit answer"
      );
    } finally {
      setSubmitting(false);
      setEditingAnswer(null);
    }
  };

  const handleEdit = (answer: Answer) => {
    setEditingAnswer(answer);
    setDescription(answer.description);
    setIsExpanded(true);
  };

  const handleDelete = async () => {
    if (!answerToDelete) return;

    try {
      await axios.delete(`/api/answers/${answerToDelete}`);
      setAnswers((prev) =>
        prev.filter((answer) => answer.id !== answerToDelete)
      );
      toast.success("Answer deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete answer");
    } finally {
      setAnswerToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAccept = async () => {
    if (!answerToModerate) return;

    try {
      await axios.put(`/api/answers/${answerToModerate}/approve`);
      setAnswers((prev) =>
        prev.map((answer) =>
          answer.id === answerToModerate
            ? { ...answer, status: "approved", isApproved: true }
            : answer
        )
      );
      toast.success("Answer approved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve answer");
    } finally {
      setAnswerToModerate(null);
      setAcceptDialogOpen(false);
    }
  };

  const handleReject = async () => {
    if (!answerToModerate) return;

    try {
      await axios.delete(`/api/answers/${answerToModerate}/reject`);
      setAnswers((prev) =>
        prev.filter((answer) => answer.id !== answerToModerate)
      );
      toast.success("Answer rejected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject answer");
    } finally {
      setAnswerToModerate(null);
      setRejectDialogOpen(false);
    }
  };

  const handleVote = async (answerId: string, voteType: "UP" | "DOWN") => {
    try {
      const response = await axios.post("/api/votes", {
        answerId,
        voteType,
      });

      if (response.data.success) {
        setAnswers((prev) =>
          prev.map((answer) =>
            answer.id === answerId
              ? {
                  ...answer,
                  upvotes: response.data.upvotes,
                  downvotes: response.data.downvotes,
                }
              : answer
          )
        );
      }
    } catch (error) {
      console.error("Voting failed:", error);
      toast.error("Failed to submit vote");
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchAnswers();
    }
  }, [questionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-zinc-400">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        <span className="text-sm font-medium">Loading answers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-red-400">
        <p>{error}</p>
        <button
          onClick={fetchAnswers}
          className="mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-white text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-serif font-semibold mb-4">Answers</h2>

      <div className="mb-8">
        {!isExpanded ? (
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm"
            onClick={() => {
              setEditingAnswer(null);
              setIsExpanded(true);
            }}
          >
            <span className="flex items-center gap-1">
              {editingAnswer ? "Edit Your Answer" : "Write Your Answer"}{" "}
              <ChevronDown className="h-4 w-4" />
            </span>
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-700 text-white rounded-md p-4">
              <Tiptap content={description} onChange={setDescription} />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                className="bg-zinc-100 hover:bg-zinc-200 text-black text-sm px-4 py-2"
                disabled={submitting}
              >
                {submitting
                  ? editingAnswer
                    ? "Updating..."
                    : "Submitting..."
                  : editingAnswer
                  ? "Update Answer"
                  : "Post Answer"}
              </Button>

              <Button
                variant="secondary"
                className="text-white bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setIsExpanded(false);
                  setEditingAnswer(null);
                  setDescription("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {answers.length === 0 ? (
        <p className="text-zinc-400">No answers yet. Be the first to answer!</p>
      ) : (
        answers.map((answer) => (
          <div
            key={answer.id}
            className={`bg-zinc-900 border rounded-md p-4 mb-6 ${
              answer.status === "approved"
                ? "border-zinc-700"
                : "border-yellow-500/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-zinc-400 mb-3">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${answer.user?.id || ""}`}>
                  {answer.user?.image ? (
                    <Image
                      src={answer.user.image}
                      alt={answer.user?.username?.[0] || "A"}
                      width={32}
                      height={32}
                      className="rounded-full border border-zinc-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs border border-zinc-700">
                      {answer.user?.username?.[0]?.toUpperCase() || "A"}
                    </div>
                  )}
                </Link>
                <Link href={`/profile/${answer.user?.id || ""}`}>
                  <span className="font-medium text-white hover:underline">
                    {answer.user?.username || "Anonymous"}
                  </span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span>
                  {formatDistanceToNowStrict(new Date(answer.updatedAt))} ago
                </span>

                <div className="sm:ml-2">
                  {answer.status === "pending" ? (
                    <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 border-yellow-500/30">
                      Pending Approval
                    </Badge>
                  ) : (
                    <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30 border-green-500/30">
                      Approved
                    </Badge>
                  )}
                </div>

                {session?.user?.id === answer.user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 ml-2 text-white hover:text-white bg-[#1a1a1e] hover:bg-[#1a1a1e]"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-zinc-700 text-white font-medium"
                        onClick={() => handleEdit(answer)}
                      >
                        <Pencil className="h-4 w-4 mr-2 text-white" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 hover:bg-red-500/10 font-medium"
                        onClick={() => {
                          setAnswerToDelete(answer.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {session?.user?.id !== answer.user?.id &&
                answer.status === "pending" && (
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                      onClick={() => {
                        setAnswerToModerate(answer.id);
                        setAcceptDialogOpen(true);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => {
                        setAnswerToModerate(answer.id);
                        setRejectDialogOpen(true);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
            </div>

            <div
              className="prose prose-invert max-w-none prose-sm break-words"
              dangerouslySetInnerHTML={{ __html: answer.description }}
            />

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <button
                className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
                onClick={() => handleVote(answer.id, "UP")}
              >
                <ChevronUp className="h-5 w-5" />
                <span>{answer.upvotes}</span>
              </button>

              <button
                className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
                onClick={() => handleVote(answer.id, "DOWN")}
              >
                <ChevronDown className="h-5 w-5" />
                <span>{answer.downvotes}</span>
              </button>

              <span className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{answer.commentCount}</span>
              </span>
            </div>
          </div>
        ))
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              answer.
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

      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this answer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the answer as approved and visible to everyone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAccept}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this answer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the answer. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleReject}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
