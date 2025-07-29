"use client";

import { useState } from "react";
import axios from "axios";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AnswerInputProps {
  questionId: string;
  onAnswerSubmit: () => void;
}

export default function AnswerInput({
  questionId,
  onAnswerSubmit,
}: AnswerInputProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/questions/${questionId}/answers`, {
        description,
      });
      toast.success("Answer submitted! Awaiting approval.");
      setDescription("");
      onAnswerSubmit();
    } catch (err) {
      toast.error("Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-md border border-zinc-700 mt-10">
      <h2 className="text-lg font-semibold mb-2">Your Answer</h2>
      <Tiptap content={description} onChange={setDescription} />
      <Button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Post Answer"}
      </Button>
    </div>
  );
}
