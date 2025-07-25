"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";

interface Question {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  coverImage?: string;
  user: {
    username: string;
    email: string;
  };
  tags: {
    tag: {
      name: string;
    };
  }[];
}

export default function ParticularQuestion() {
  const params = useParams();
  const router = useRouter();
  const questionId = params?.questionId as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setCurrentUserEmail(session?.user?.email ?? null);
    };
    fetchSession();
  }, []);

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
          setEditTitle(res.data.question.title);
          setEditTags(
            res.data.question.tags.map((t: any) => t.tag.name).join(", ")
          );
          setEditDescription(res.data.question.description);
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

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(`/api/questions/${questionId}`);
      if (res.data.success) {
        alert("Question deleted successfully");
        router.push("/feed");
      } else {
        alert(res.data.message || "Failed to delete question");
      }
    } catch (error: any) {
      console.error("Error deleting question:", error);
      alert("Something went wrong while deleting the question.");
    }
  };

  const handleUpdate = async () => {
    const tags = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!editTitle || !editDescription || tags.length === 0) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.put(`/api/questions/${questionId}`, {
        title: editTitle,
        description: editDescription,
        tags,
        coverImage: editCoverImage,
      });

      if (res.data.success) {
        setQuestion(res.data.question);
        setIsEditing(false);
        alert("Question updated successfully");
      } else {
        alert(res.data.message || "Failed to update question");
      }
    } catch (err: any) {
      console.error("Error updating question:", err);
      alert("Something went wrong while updating the question.");
    }
  };

  const isAuthor = question?.user.email === currentUserEmail;

  if (loading)
    return <div className="p-6 text-center">Loading question...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );
  if (!question)
    return (
      <div className="p-6 text-center text-gray-600">Question not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {isEditing ? (
        <>
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Tiptap
              content={editDescription}
              onChange={(content) => setEditDescription(content)}
              onImageUpload={(base64) => setEditCoverImage(base64)}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpdate}>Save</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
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
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />

          {isAuthor && (
            <div className="flex gap-4">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
