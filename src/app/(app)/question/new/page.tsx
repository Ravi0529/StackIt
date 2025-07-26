"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeftCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AskNewQuestionPage() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !description || tags.length === 0) {
      setError("Title, description, and at least one tag are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/questions", {
        title,
        description,
        tags,
      });

      if (response.data.success) {
        toast.success("Question posted successfully!");
        router.push("/feed");
      } else {
        setError(response.data.message || "Failed to create question.");
      }
    } catch (error: unknown) {
      // console.error("Error submitting question:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred.");
      } else {
        setError("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-900/30 text-white border-red-700"
          >
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold font-serif mb-2">
            Ask a New Question
          </h1>
          <p className="text-gray-400 text-sm">
            Get help from the community by sharing your doubts.
          </p>
        </motion.div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">
            Title
          </Label>
          <Input
            id="title"
            placeholder="e.g. How do I use Prisma with Next.js?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white !text-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Description
          </Label>
          <div className="bg-zinc-900 border border-zinc-700 rounded-md p-2">
            <Tiptap onChange={(content) => setDescription(content)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-white">
            Tags
          </Label>

          <Input
            id="tags"
            placeholder="Type a tag and press Enter or comma"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                e.preventDefault();
                const newTag = tagInput.trim().replace(/,/g, "");
                if (!tags.includes(newTag)) {
                  setTags([...tags, newTag]);
                }
                setTagInput("");
              }
              if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                setTags((prev) => prev.slice(0, -1));
              }
            }}
            className="bg-zinc-900 border-zinc-700 text-white"
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-blue-600/30 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-500"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                  className="hover:text-white text-blue-300"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black hover:bg-zinc-200 transition font-semibold px-6 py-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Posting...
              </>
            ) : (
              "Post Question"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
