"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Question {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  createdAt: string;
  user: {
    username: string;
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

// Helper function to strip HTML and truncate
function stripAndTrimDescription(html: string, wordLimit: number): string {
  const text = html.replace(/<[^>]+>/g, ""); // Remove HTML tags
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
      const res = await axios.get(`/api/questions?page=${page}`);
      const { questions, totalPages } = res.data;
      setQuestions(questions);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Questions Feed</h1>
        <Button onClick={() => router.push("/question/new")}>
          Ask a Question
        </Button>
      </div>

      {loading ? (
        <p className="text-center">Loading questions...</p>
      ) : (
        <>
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded shadow mb-4 border border-gray-200"
            >
              <Link href={`/question/${q.id}`}>
                <h2 className="text-xl font-semibold hover:underline">
                  {q.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-600 mb-1">
                Asked by <span className="font-medium">{q.user.username}</span>{" "}
                • {new Date(q.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {q.tags.map((t) => (
                  <span
                    key={t.tag.name}
                    className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                  >
                    {t.tag.name}
                  </span>
                ))}
              </div>
              <p className="text-gray-800 text-sm mb-2">
                {stripAndTrimDescription(q.description, 30)}
              </p>
              <p className="text-sm text-gray-700">
                {q._count.answers} answer{q._count.answers !== 1 && "s"}
              </p>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
