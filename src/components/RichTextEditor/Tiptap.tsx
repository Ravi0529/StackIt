"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Heading from "@tiptap/extension-heading";
import lowlight from "@/utils/lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "./CodeBlockComponent";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        heading: false,
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
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "my-custom-heading",
        },
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
      BulletList.configure({
        HTMLAttributes: { class: "list-disc pl-6" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal pl-6" },
      }),
      ListItem.configure({
        HTMLAttributes: { class: "my-custom-list-item" },
      }),
    ],
    content: "<p>Add your description here</p>",
    immediatelyRender: false,
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

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
          onClick={() => editor?.commands.toggleHeading({ level: 1 })}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("heading", { level: 1 })
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          H1
        </button>

        <button
          onClick={() => editor?.commands.toggleHeading({ level: 2 })}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("heading", { level: 2 })
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          H2
        </button>

        <button
          onClick={() => editor?.commands.toggleHeading({ level: 3 })}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("heading", { level: 3 })
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          H3
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

        <button
          onClick={() => editor?.commands.toggleBulletList()}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("bulletList") ? "bg-black text-white" : "bg-white"
          }`}
        >
          Bullet List
        </button>

        <button
          onClick={() => editor?.commands.toggleOrderedList()}
          className={`px-2 py-1 border rounded ${
            editor?.isActive("orderedList") ? "bg-black text-white" : "bg-white"
          }`}
        >
          Ordered List
        </button>
      </div>

      <EditorContent editor={editor} className="border p-2 rounded" />
    </div>
  );
}
