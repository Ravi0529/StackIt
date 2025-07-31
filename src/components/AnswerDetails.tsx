"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import User from "../../assets/user.png";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Answer {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "approved" | "pending";
  user: {
    id: string;
    username: string;
    image?: string | null;
  };
  commentCount: number;
  upvotes: number;
  downvotes: number;
}

interface AnswerDetailsProps {
  questionId: string;
}

export default function AnswerDetails({ questionId }: AnswerDetailsProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnswers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/questions/${questionId}/answers`);
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch answers");
      }
      if (!Array.isArray(response.data.answers)) {
        throw new Error("Invalid answers data format");
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
                <Link href={`/profile/${answer.user.id}`}>
                  {answer.user.image ? (
                    <Image
                      src={answer.user.image || User}
                      alt={answer.user.username[0]}
                      width={32}
                      height={32}
                      className="rounded-full border border-zinc-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs border border-zinc-700">
                      {answer.user.username[0].toUpperCase()}
                    </div>
                  )}
                </Link>
                <Link href={`/profile/${answer.user.id}`}>
                  <span className="font-medium text-white hover:underline">
                    {answer.user.username}
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
              </div>
            </div>

            <div
              className="prose prose-invert max-w-none prose-sm break-words"
              dangerouslySetInnerHTML={{ __html: answer.description }}
            />

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors">
                <ChevronUp className="h-5 w-5" />
                <span>{answer.upvotes}</span>
              </span>

              <span className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors">
                <ChevronDown className="h-5 w-5" />
                <span>{answer.downvotes}</span>
              </span>

              <span className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{answer.commentCount}</span>
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
