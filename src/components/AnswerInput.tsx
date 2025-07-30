"use client";

import { useState } from "react";
import axios from "axios";
import { Tiptap } from "@/components/RichTextEditor/Tiptap";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSession } from "next-auth/react";
import { ChevronUp } from "lucide-react";

interface AnswerInputProps {
  questionId: string;
  onAnswerSubmit: () => void;
}

export default function AnswerInput({
  questionId,
  onAnswerSubmit,
}: AnswerInputProps) {
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
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
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 rounded-t-lg rounded-b-none px-5 py-2 text-sm shadow-lg"
            >
              <span className="flex items-center gap-1">
                Know the Answer? <ChevronUp className="h-4 w-4" />
              </span>
            </Button>
          </DrawerTrigger>

          <DrawerContent className="bg-[#1a1a1e] border-t-2 border-blue-600">
            <div
              className="mx-auto w-full max-w-3xl flex flex-col"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <DrawerHeader className="text-left px-0">
                <DrawerTitle className="text-white text-xl font-serif font-bold">
                  Write your answer
                </DrawerTitle>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto p-0 space-y-4">
                <div className="bg-zinc-900 border border-zinc-700 text-white rounded-md p-2 h-fit">
                  <Tiptap content={description} onChange={setDescription} />
                </div>
              </div>

              <div className="flex justify-center pb-4 pt-2 bg-[#1a1a1e] sticky bottom-0">
                <Button
                  onClick={handleSubmit}
                  className="bg-zinc-100 hover:bg-zinc-200 text-black text-sm px-4 py-2"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Post Answer"}
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
