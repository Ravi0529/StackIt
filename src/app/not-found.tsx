"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-[#1a1a1e] text-white font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-6xl font-extrabold font-serif text-white mb-6">
          404
        </h1>
        <p className="text-2xl font-semibold mb-4">Page Not Found</p>
        <p className="text-gray-400 mb-10">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-black font-semibold py-4 px-8 rounded-lg transition-colors border border-[#444] shadow-sm text-md"
          >
            Back to Feed
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
