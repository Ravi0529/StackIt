"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Users2,
  Vote,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-[#1a1a1e] text-white font-sans">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow transition-shadow hover:shadow-lg"
        >
          <HelpCircle className="mx-auto text-blue-400 mb-2" size={28} />
          <h3 className="font-semibold text-lg">Ask Questions</h3>
          <p className="text-sm text-gray-400">
            Get help from a growing community of peers.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow transition-shadow hover:shadow-lg"
        >
          <MessageSquare className="mx-auto text-green-400 mb-2" size={28} />
          <h3 className="font-semibold text-lg">Share Answers</h3>
          <p className="text-sm text-gray-400">
            Contribute your expertise and gain recognition.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow transition-shadow hover:shadow-lg"
        >
          <Users2 className="mx-auto text-yellow-400 mb-2" size={28} />
          <h3 className="font-semibold text-lg">Build Community</h3>
          <p className="text-sm text-gray-400">
            Connect with like-minded learners & developers.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow transition-shadow hover:shadow-lg"
        >
          <Vote className="mx-auto text-pink-400 mb-2" size={28} />
          <h3 className="font-semibold text-lg">Vote on Answers</h3>
          <p className="text-sm text-gray-400">
            Upvote helpful responses and find the best answers faster.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-16 text-center max-w-xl text-gray-400 italic text-sm"
      >
        “The beautiful thing about learning is that nobody can take it away from
        you.”
      </motion.div>
    </div>
  );
}
