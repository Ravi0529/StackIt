"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "@/utils/lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "./CodeBlockComponent";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
        codeBlock: false,
      }),
      Bold.configure({
        HTMLAttributes: { class: "my-custom-bold" },
      }),
      Italic.configure({
        HTMLAttributes: { class: "my-custom-italic" },
      }),
      Underline.configure({
        HTMLAttributes: { class: "my-custom-underline" },
      }),
      Strike.configure({
        HTMLAttributes: { class: "my-custom-strike" },
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: { class: "my-custom-highlight" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
        languageClassPrefix: "language-",
        HTMLAttributes: {
          class: "my-custom-codeblock",
        },
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }),
    ],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
  });

  return (
    <div className="space-y-4">
      <div className="toolbar flex flex-wrap gap-2">
        <button
          onClick={() => editor?.commands.toggleBold()}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("bold") ? "bg-black text-white" : "bg-white"
          }`}
        >
          Bold
        </button>

        <button
          onClick={() => editor?.commands.toggleItalic()}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("italic") ? "bg-black text-white" : "bg-white"
          }`}
        >
          Italic
        </button>

        <button
          onClick={() => editor?.commands.toggleUnderline()}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("underline") ? "bg-black text-white" : "bg-white"
          }`}
        >
          Underline
        </button>

        <button
          onClick={() => editor?.commands.toggleStrike()}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("strike") ? "bg-black text-white" : "bg-white"
          }`}
        >
          Strike
        </button>

        <button
          onClick={() => editor?.commands.toggleHighlight({ color: "#FFFF00" })}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("highlight", { color: "#FFFF00" })
              ? "bg-yellow-300"
              : "bg-white"
          }`}
        >
          Highlight Yellow
        </button>

        <button
          onClick={() => editor?.commands.toggleHighlight({ color: "#FF0000" })}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("highlight", { color: "#FF0000" })
              ? "bg-red-400 text-white"
              : "bg-white"
          }`}
        >
          Highlight Red
        </button>

        <button
          onClick={() => {
            const url = prompt("Enter a URL");
            if (url) editor?.commands.toggleLink({ href: url });
          }}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("link") ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          Link
        </button>

        <button
          onClick={() => editor?.commands.unsetLink()}
          className="px-2 py-1 border rounded"
        >
          Remove Link
        </button>

        <button
          onClick={() => editor?.commands.toggleCodeBlock()}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("codeBlock")
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
        >
          Code Block
        </button>
      </div>

      <EditorContent editor={editor} className="border p-2 rounded" />
    </div>
  );
}
