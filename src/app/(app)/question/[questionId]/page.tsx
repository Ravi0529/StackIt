"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { getSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";
import {
  ArrowLeftCircle,
  Loader2,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import User from "../../../../../assets/user.png";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Question } from "@/types/question";
import AnswerSection from "@/components/AnswerSection";

export default function SingleQuestionDetails() {
  const params = useParams();
  const router = useRouter();
  const questionId = params?.questionId as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session?.user) {
        toast.error("You need to be signed in to view this page.");
        router.push("/signin");
        return;
      }
      setCurrentUserEmail(session?.user?.email ?? null);
      setSessionChecked(true);
    };
    fetchSession();
  }, [router]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/questions/${questionId}`);
        if (response.data.success) {
          const q = response.data.question;
          setQuestion(q);
          setEditTitle(q.title);
          setEditTags(q.tags.map((t: { tag: { name: string } }) => t.tag.name));
          setEditDescription(q.description);
        }
      } catch (error) {
        setError("Failed to load question.");
      } finally {
        setLoading(false);
      }
    };
    if (sessionChecked && questionId) {
      fetchQuestion();
    }
  }, [questionId, sessionChecked]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/questions/${questionId}`);
      if (response.data.success) {
        toast.success("Question deleted successfully");
        router.push("/feed");
      } else {
        toast.error(response.data.message || "Deletion failed");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.");
    }
  };

  const handleUpdate = async () => {
    const tags = editTags.filter(Boolean);

    if (!editTitle || !editDescription || tags.length === 0) {
      toast.error("Title, description and at least one tag are required.");
      return;
    }

    try {
      const response = await axios.put(`/api/questions/${questionId}`, {
        title: editTitle,
        description: editDescription,
        tags,
      });

      if (response.data.success) {
        toast.success("Question updated successfully");
        setIsEditing(false);
        setQuestion(response.data.question);
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong while updating.");
    }
  };

  if (!sessionChecked || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1a1a1e] text-zinc-300">
        <Loader2 className="animate-spin h-6 w-6 mr-2 text-zinc-400" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  if (!question) {
    return (
      <Alert
        variant="destructive"
        className="bg-red-900/30 border-red-800 text-white max-w-xl mx-auto mt-12"
      >
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Question not found.</AlertDescription>
      </Alert>
    );
  }

  const isAuthor = question.user.email === currentUserEmail;

  return (
    <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeftCircle className="h-4 w-4 mr-2" />
            Back to Feed
          </button>
        </div>
        {isEditing ? (
          <>
            <h1 className="text-3xl font-serif font-bold">Edit Question</h1>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="mb-2">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white !text-xl"
                />
              </div>
              <div>
                <Label className="mb-2">Description</Label>
                <div className="bg-zinc-900 border border-zinc-700 rounded-md p-2">
                  <Tiptap
                    content={editDescription}
                    onChange={setEditDescription}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags" className="text-white">
                  Tags
                </Label>

                <Input
                  id="edit-tags"
                  placeholder="Type a tag and press Enter or comma"
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      (e.key === "Enter" || e.key === ",") &&
                      editTagInput.trim()
                    ) {
                      e.preventDefault();
                      const newTag = editTagInput.trim().replace(/,/g, "");
                      if (!editTags.includes(newTag)) {
                        setEditTags([...editTags, newTag]);
                      }
                      setEditTagInput("");
                    }
                    if (
                      e.key === "Backspace" &&
                      !editTagInput &&
                      editTags.length > 0
                    ) {
                      setEditTags((prev) => prev.slice(0, -1));
                    }
                  }}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {editTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 bg-blue-600/30 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-500"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setEditTags(editTags.filter((_, i) => i !== idx))
                        }
                        className="hover:text-white text-blue-300"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleUpdate}
                  className="bg-zinc-100 text-black hover:bg-zinc-200"
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold mb-2">
              {question.title}
            </h1>
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
              <Link href={`/profile/${question.user.id}`}>
                {question.user.image ? (
                  <Image
                    src={question.user.image || User}
                    alt={question.user.username[0].toUpperCase()}
                    width={40}
                    height={40}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
                    {question.user.username[0].toUpperCase()}
                  </div>
                )}
              </Link>
              <div>
                Asked by{" "}
                <Link href={`/profile/${question.user.id}`}>
                  <span className="font-medium text-white">
                    {question.user.username}
                  </span>
                </Link>{" "}
                • {formatDistanceToNowStrict(new Date(question.updatedAt))} ago
              </div>
              {isAuthor && (
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-1 h-auto w-auto text-white hover:text-white bg-[#1a1a1e] hover:bg-[#1a1a1e]"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    >
                      <DropdownMenuItem
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer hover:bg-zinc-700"
                      >
                        <Pencil className="h-4 w-4 inline mr-1 font-medium text-white" />{" "}
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer hover:bg-red-700 text-red-500"
                          >
                            <Trash2 className="h-4 w-4 inline mr-1 font-medium text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the question.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-zinc-700 hover:bg-zinc-600 text-white hover:text-white">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((t) => (
                <span
                  key={t.tag.name}
                  className="text-sm bg-blue-600/30 text-blue-200 px-3 py-1 rounded-full border border-blue-500"
                >
                  {t.tag.name}
                </span>
              ))}
            </div>
            <div
              className="prose prose-invert max-w-full sm:prose-base prose-sm break-words overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            <style jsx global>{`
              .prose h1 {
                font-size: 1.75rem;
              }

              .prose h2 {
                font-size: 1.5rem;
              }

              .prose h3 {
                font-size: 1.25rem;
              }

              .prose pre {
                background-color: #0d0d0d;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
              }

              .prose code {
                background-color: #1e1e1e;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                color: #f472b6;
              }
            `}</style>
          </>
        )}

        <Separator />

        <AnswerSection questionId={question.id} />
      </div>
    </div>
  );
}
