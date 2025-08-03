"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f11] border-t border-[#2a2a36] text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 md:pr-8">
            <Link href="/feed" className="flex items-center gap-2 group">
              <span className="text-2xl font-extrabold tracking-tight text-white font-serif">
                StackIt
              </span>
            </Link>
            <p className="text-gray-400 max-w-md">
              A community-driven Q&A platform for developers to share knowledge
              and grow together.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://x.com/Ravidotexe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/ravi-mistry-0b2875301/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/Ravi0529"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4 md:pl-8 md:border-l md:border-[#2a2a36]">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/feed"
                  className="hover:text-white transition block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/question/new"
                  className="hover:text-white transition block py-1"
                >
                  Ask Question
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2a36] text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} StackIt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
