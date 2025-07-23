"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Feed() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Button className="mb-4" onClick={() => router.push("/question/new")}>
        Ask a Question
      </Button>
      <h1 className="text-4xl font-bold">Feed</h1>
    </div>
  );
}
