"use client";

import React, { useEffect, useRef } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";

const LANGUAGES = [
  "plaintext",
  "javascript",
  "typescript",
  "html",
  "css",
  "json",
  "python",
  "java",
  "cpp",
  "c",
  "sql",
  "xml",
];

export default function CodeBlockComponent({
  node,
  updateAttributes,
}: NodeViewProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const currentLanguage = node.attrs.language || "plaintext";

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = currentLanguage;
    }
  }, [currentLanguage]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAttributes({ language: e.target.value });
  };

  return (
    <NodeViewWrapper
      as="div"
      className="relative bg-[#1e1e1e] text-white rounded-lg p-2 my-4"
    >
      <select
        ref={selectRef}
        onChange={handleLanguageChange}
        className="absolute top-2 right-2 bg-gray-700 text-white text-sm px-2 py-1 rounded"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre className="overflow-x-auto mt-6">
        <code>
          <NodeViewContent as="div" />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
