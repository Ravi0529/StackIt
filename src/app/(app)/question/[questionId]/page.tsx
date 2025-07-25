"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Question {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  user: {
    username: string;
  };
  tags: {
    tag: {
      name: string;
    };
  }[];
}

export default function ParticularQuestion() {
  const params = useParams();
  const questionId = params?.questionId as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        setError("No question ID provided.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/questions/${questionId}`);
        if (res.data.success) {
          setQuestion(res.data.question);
        } else {
          setError(res.data.message || "Failed to load question");
        }
      } catch (err: any) {
        console.error("Error fetching question:", err);
        setError("Something went wrong while fetching the question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return <div className="p-6 text-center">Loading question...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  if (!question) {
    return (
      <div className="p-6 text-center text-gray-600">Question not found.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Asked by{" "}
        <span className="font-medium text-gray-700">
          {question.user.username}
        </span>{" "}
        • {new Date(question.createdAt).toLocaleDateString()}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((t) => (
          <span
            key={t.tag.name}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            {t.tag.name}
          </span>
        ))}
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />
    </div>
  );
}
