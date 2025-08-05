"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeftCircle, Loader2, Search } from "lucide-react";
import Image from "next/image";
import User from "../../../../assets/user.png";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { Question } from "@/types/question";
import axios from "axios";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [searchType, setSearchType] = useState<
    "all" | "title" | "user" | "tag"
  >((searchParams.get("type") as "all" | "title" | "user" | "tag") || "all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setQuestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `/api/search?q=${encodeURIComponent(
            query
          )}&type=${searchType}&page=${page}`
        );
        const { questions, totalPages } = response.data;
        setQuestions(questions);
        setTotalPages(totalPages);
      } catch (error) {
        toast.error("Failed to fetch search results");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, searchType, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
  };

  const goToPage = (newPage: number) => {
    router.push(
      `/search?q=${encodeURIComponent(
        query
      )}&type=${searchType}&page=${newPage}`
    );
  };

  function stripAndTrimDescription(html: string, wordLimit: number): string {
    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-7">
          <button
            onClick={() => router.push("/feed")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeftCircle className="h-4 w-4 mr-2" />
            Back to Feed
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold font-serif mb-6">
            Search Questions
          </h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => setSearchType("all")}
                className={`text-sm px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  searchType === "all"
                    ? "bg-blue-600/20 text-blue-300 hover:text-blue-300 border border-blue-500/50 hover:bg-blue-600/30"
                    : "bg-zinc-800/50 text-zinc-100 hover:text-zinc-100 hover:bg-zinc-700/50 border border-zinc-700"
                }`}
              >
                All
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSearchType("title")}
                className={`text-sm px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  searchType === "title"
                    ? "bg-blue-600/20 text-blue-300 hover:text-blue-300 border border-blue-500/50 hover:bg-blue-600/30"
                    : "bg-zinc-800/50 text-zinc-100 hover:text-zinc-100 hover:bg-zinc-700/50 border border-zinc-700"
                }`}
              >
                By Title
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSearchType("user")}
                className={`text-sm px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  searchType === "user"
                    ? "bg-blue-600/20 text-blue-300 hover:text-blue-300 border border-blue-500/50 hover:bg-blue-600/30"
                    : "bg-zinc-800/50 text-zinc-100 hover:text-zinc-100 hover:bg-zinc-700/50 border border-zinc-700"
                }`}
              >
                By User
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSearchType("tag")}
                className={`text-sm px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  searchType === "tag"
                    ? "bg-blue-600/20 text-blue-300 hover:text-blue-300 border border-blue-500/50 hover:bg-blue-600/30"
                    : "bg-zinc-800/50 text-zinc-100 hover:text-zinc-100 hover:bg-zinc-700/50 border border-zinc-700"
                }`}
              >
                By Tag
              </Button>
            </div>
          </form>

          {query && (
            <p className="text-gray-400">
              Showing results for &quot;{query}&quot; in{" "}
              {searchType === "all" ? "all fields" : searchType}
            </p>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-6 w-6 text-white" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {questions.length === 0 && query && !loading ? (
              <p className="text-gray-400 text-center py-10">
                No results found for your search.
              </p>
            ) : null}

            {questions.map((q) => (
              <Card
                key={q.id}
                onClick={() => router.push(`/question/${q.id}`)}
                className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 cursor-pointer transition"
              >
                <CardContent className="p-2 pl-4 md:p-4 space-y-2 flex gap-4 items-start">
                  <div
                    className="hidden md:block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={`/profile/${q.user.id}`}>
                      {q.user.image ? (
                        <Image
                          src={q.user.image || User}
                          alt={q.user.username[0].toUpperCase()}
                          width={40}
                          height={40}
                          className="w-15 h-15 rounded-full object-cover border border-zinc-700"
                        />
                      ) : (
                        <div className="w-15 h-15 rounded-full bg-zinc-700 text-white flex items-center justify-center text-sm font-semibold border border-zinc-600">
                          {q.user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-semibold font-sans hover:underline">
                      {q.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Asked by{" "}
                      <span className="font-medium">{q.user.username}</span> •{" "}
                      <span className="sm:hidden">
                        {formatDistanceToNowStrict(new Date(q.updatedAt))} ago
                      </span>
                      <span className="hidden sm:inline">
                        Updated{" "}
                        {formatDistanceToNowStrict(new Date(q.updatedAt))} ago
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {q.tags.map((t) => (
                        <Badge
                          key={t.tag.name}
                          className="bg-blue-600/30 text-blue-300 border border-blue-500"
                        >
                          {t.tag.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm hidden md:block">
                      {stripAndTrimDescription(q.description, 20)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {q._count.answers} answer{q._count.answers !== 1 && "s"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {questions.length > 0 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700 cursor-pointer"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700 cursor-pointer"
                >
                  Next
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-6 w-6 text-white" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
