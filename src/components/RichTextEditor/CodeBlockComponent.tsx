"use client";

import React from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  "plaintext",
  "json",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Python",
  "C",
  "C++",
  "Java",
  "SQL",
  "XML",
];

export default function CodeBlockComponent({
  node,
  updateAttributes,
}: NodeViewProps) {
  const currentLanguage = node.attrs.language || "plaintext";

  const handleLanguageChange = (language: string) => {
    updateAttributes({ language });
  };

  return (
    <NodeViewWrapper
      as="div"
      className="relative bg-[#0d0d0d] text-white rounded-lg p-4 my-4 border border-zinc-800"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 hover:text-white transition-colors px-3 py-1 rounded cursor-pointer"
          >
            {currentLanguage}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-md shadow-lg"
        >
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                currentLanguage === lang
                  ? "bg-zinc-700 font-semibold"
                  : "hover:bg-zinc-800"
              }`}
            >
              {lang}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <pre className="overflow-x-auto mt-6 text-sm leading-relaxed font-mono">
        <code>
          <NodeViewContent as="div" />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
