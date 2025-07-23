"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
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
    ],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
  });

  return (
    <div className="space-y-4">
      <div className="toolbar space-x-2">
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
      </div>

      <EditorContent editor={editor} className="border p-2 rounded" />
    </div>
  );
}
