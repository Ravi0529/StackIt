"use client";

import { useState } from "react";
import axios from "axios";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";

interface AnswerInputProps {
  questionId: string;
  onAnswerSubmit: () => void;
}

export default function AnswerInput({
  questionId,
  onAnswerSubmit,
}: AnswerInputProps) {
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/questions/${questionId}/answers`, {
        description,
        userId: session.user.id,
      });

      toast.success("Answer submitted! Awaiting approval.");
      setDescription("");
      onAnswerSubmit();
      setIsExpanded(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans mt-8">
      <h2 className="text-xl font-serif font-semibold mb-4">Answers</h2>

      {!isExpanded ? (
        <Button
          variant="default"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm"
          onClick={() => setIsExpanded(true)}
        >
          <span className="flex items-center gap-1">
            Write Your Answer <ChevronDown className="h-4 w-4" />
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
              disabled={loading}
            >
              {loading ? "Submitting..." : "Post Answer"}
            </Button>

            <Button
              variant="secondary"
              className="text-white bg-red-600 hover:bg-red-700"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
