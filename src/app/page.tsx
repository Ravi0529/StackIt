"use client";

import { useEffect, useState } from "react";

// Types based on Prisma schema and API response
interface User {
  id: string;
  username: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Answer {
  id: string;
  content: string;
  createdAt: string;
  user?: User;
  votes?: { id: string }[];
}

interface Question {
  id: string;
  title: string;
  description: string;
  user?: User;
  tags?: Tag[];
  answers: Answer[];
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/get-all-qnas");
        const data = await res.json();
        if (data.success) {
          setQuestions(data.data);
        } else {
          setError(data.error || "Failed to fetch questions");
        }
      } catch (err) {
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Questions & Answers</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        <div className="space-y-8">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-gray-900 rounded-lg border border-gray-800 p-6"
            >
              <div className="flex items-center mb-2">
                <span className="font-semibold text-lg mr-2">{q.title}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  by {q.user?.username || "Unknown"}
                </span>
              </div>
              <p className="mb-2 text-gray-300">{q.description}</p>
              <div className="mb-2 flex flex-wrap gap-2">
                {q.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-gray-800 text-xs px-2 py-1 rounded"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <span className="font-semibold">Answers:</span>
                {q.answers.length === 0 ? (
                  <span className="ml-2 text-gray-400">No answers yet.</span>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {q.answers.map((a) => (
                      <li key={a.id} className="border-t border-gray-800 pt-2">
                        <div className="flex items-center text-sm mb-1">
                          <span className="font-medium">
                            {a.user?.username || "Unknown"}
                          </span>
                          <span className="ml-2 text-gray-500">
                            {new Date(a.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-gray-200">{a.content}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Votes: {a.votes?.length || 0}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
