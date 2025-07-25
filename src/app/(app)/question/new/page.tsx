"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";

export default function AskNewQuestionPage() {
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title || !description || tags.length === 0) {
      alert("Title, description, and at least one tag are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/questions", {
        title,
        description,
        tags,
      });

      if (res.data.success) {
        router.push("/feed");
      } else {
        alert(res.data.message || "Failed to create question.");
      }
    } catch (error: any) {
      console.error("Error submitting question:", error);
      alert(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter your question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="e.g. javascript, nextjs, prisma"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Tiptap onChange={(content) => setDescription(content)} />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Posting..." : "Post Question"}
      </Button>
    </div>
  );
}
