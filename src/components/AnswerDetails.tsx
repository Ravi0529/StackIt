"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import User from "../../assets/user.png";

interface Answer {
  id: string;
  description: string;
  createdAt: string;
  user: {
    username: string;
    image?: string | null;
  };
  isApproved: boolean;
}

interface AnswerDetailsProps {
  questionId: string;
}

export default function AnswerDetails({ questionId }: AnswerDetailsProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(`/api/questions/${questionId}/answers`);
      setAnswers(res.data.answers || []);
    } catch {
      // error already handled in toast or silence
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [questionId]);

  if (loading)
    return <div className="text-gray-400 mt-8">Loading answers...</div>;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Answers</h2>
      {answers.length === 0 ? (
        <p className="text-gray-400">No answers yet.</p>
      ) : (
        answers
          .filter((a) => a.isApproved) // show only approved ones
          .map((answer) => (
            <div
              key={answer.id}
              className="bg-zinc-800 border border-zinc-700 rounded-md p-4 mb-4"
            >
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Image
                  src={answer.user.image || User}
                  alt={answer.user.username[0]}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span>{answer.user.username}</span>
                <span>
                  • {formatDistanceToNowStrict(new Date(answer.createdAt))} ago
                </span>
              </div>
              <div
                className="prose prose-invert max-w-none prose-sm"
                dangerouslySetInnerHTML={{ __html: answer.description }}
              />
            </div>
          ))
      )}
    </div>
  );
}
