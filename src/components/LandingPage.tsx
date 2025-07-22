"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-[#1a1a1e] text-white font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-5xl font-extrabold font-serif mb-6 text-white">
          Ask It. StackIt
        </h1>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          StackIt is a lightweight, community-driven Q&A platform built for
          seamless knowledge sharing. Ask questions, give answers, and grow
          together.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          href="/feed"
          className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-black font-semibold py-4 px-8 rounded-lg transition-colors border border-[#444] shadow-sm text-md"
        >
          Explore Questions
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </div>
  );
}
