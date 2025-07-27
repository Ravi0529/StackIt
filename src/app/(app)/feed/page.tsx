"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import User from "../../../../assets/user.png";
import { formatDistanceToNowStrict } from "date-fns";

interface Question {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    image?: string;
  };
  tags: {
    tag: {
      name: string;
    };
  }[];
  _count: {
    answers: number;
  };
}

function stripAndTrimDescription(html: string, wordLimit: number): string {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
}

export default function Feed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/questions?page=${page}`);
      const { questions, totalPages } = response.data;
      setQuestions(questions);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      toast.error("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const goToPage = (page: number) => {
    router.push(`/feed?page=${page}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold font-serif">
            Explore Hot Questions
          </h1>
          <Button
            onClick={() => router.push("/question/new")}
            className="bg-zinc-100 hover:bg-zinc-200 text-black cursor-pointer"
          >
            Ask a Question
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-6 w-6 text-white" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {questions.map((q) => (
              <Card
                key={q.id}
                onClick={() => router.push(`/question/${q.id}`)}
                className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 cursor-pointer transition"
              >
                <CardContent className="p-2 pl-4 md:p-4 space-y-2 flex gap-4 items-start">
                  <div className="hidden md:block">
                    {q.user.image ? (
                      <Image
                        src={q.user.image || User}
                        alt={q.user.username[0].toUpperCase()}
                        width={40}
                        height={40}
                        className="w-15 h-15 rounded-full object-cover border border-zinc-700"
                      />
                    ) : (
                      <div className="w-15 h-15 rounded-full bg-zinc-700 text-white flex items-center justify-center text-sm font-semibold border border-zinc-600">
                        {q.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-semibold font-sans hover:underline">
                      {q.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Asked by{" "}
                      <span className="font-medium">{q.user.username}</span> •{" "}
                      <span className="sm:hidden">
                        {formatDistanceToNowStrict(new Date(q.updatedAt))} ago
                      </span>
                      <span className="hidden sm:inline">
                        Updated{" "}
                        {formatDistanceToNowStrict(new Date(q.updatedAt))} ago
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {q.tags.map((t) => (
                        <Badge
                          key={t.tag.name}
                          className="bg-blue-600/30 text-blue-300 border border-blue-500"
                        >
                          {t.tag.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm hidden md:block">
                      {stripAndTrimDescription(q.description, 20)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {q._count.answers} answer{q._count.answers !== 1 && "s"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
