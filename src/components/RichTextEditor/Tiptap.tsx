"use client";

import { useState, useRef } from "react";
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
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import lowlight from "@/utils/lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "./CodeBlockComponent";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import tippy from "tippy.js";

const users = [
  { id: "1", label: "Ravi" },
  { id: "2", label: "Alex" },
  { id: "3", label: "Taylor" },
];

const createMentionSuggestion = (items: { id: string; label: string }[]) => ({
  items: ({ query }: { query: string }) => {
    return items
      .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  },
  render: () => {
    let component: HTMLDivElement;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = document.createElement("div");
        component.className =
          "mention-list bg-white border rounded shadow p-1 text-sm";
        component.style.display = "flex";
        component.style.flexDirection = "column";
        component.style.gap = "0.25rem";

        props.items.forEach((item: any) => {
          const el = document.createElement("button");
          el.className =
            "mention-item text-left hover:bg-gray-200 px-2 py-1 w-full";
          el.textContent = item.label;
          el.addEventListener("click", () =>
            props.command({ id: item.id, label: item.label })
          );
          component.appendChild(el);
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component,
          showOnCreate: true,
          interactive: true,
        })[0];
      },
      onUpdate: (props: any) => {
        while (component.firstChild) {
          component.removeChild(component.firstChild);
        }

        props.items.forEach((item: any) => {
          const el = document.createElement("button");
          el.className =
            "mention-item text-left hover:bg-gray-200 px-2 py-1 w-full";
          el.textContent = item.label;
          el.addEventListener("click", () =>
            props.command({ id: item.id, label: item.label })
          );
          component.appendChild(el);
        });
      },
      onExit: () => {
        popup?.destroy();
      },
    };
  },
});

interface TiptapProps {
  onChange: (content: string) => void;
  onImageUpload: (base64Image: string) => void;
}

export const Tiptap: React.FC<TiptapProps> = ({ onChange, onImageUpload }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      StarterKit.configure({
        bold: false,
        italic: false,
        underline: false,
        strike: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        heading: false,
        horizontalRule: false,
        link: false,
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
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
        HTMLAttributes: {
          class: "my-custom-emoji",
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
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "my-custom-image rounded shadow",
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention text-blue-600 font-medium",
        },
        suggestion: {
          char: "@",
          ...createMentionSuggestion(users),
        },
      }),
    ],
    content: "<p>Add your description here</p>",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const toggleEmojiPicker = () => {
    if (!emojiBtnRef.current) return;

    const rect = emojiBtnRef.current.getBoundingClientRect();
    setPickerPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
    setShowEmojiPicker((prev) => !prev);
  };

  const handleLocalImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.commands.setImage({ src: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 relative">
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
          onClick={() => editor?.commands.setHorizontalRule()}
          className="px-2 py-1 border rounded bg-white"
        >
          Horizontal Rule
        </button>

        <button
          ref={emojiBtnRef}
          onClick={toggleEmojiPicker}
          className="px-2 py-1 border rounded bg-white"
        >
          Emoji
        </button>

        {showEmojiPicker && (
          <div
            className="absolute z-50 max-w-[90vw] sm:max-w-full"
            style={{
              top: pickerPos.top,
              left:
                pickerPos.left + 350 > window.innerWidth
                  ? window.innerWidth - 360
                  : pickerPos.left,
            }}
          >
            <div className="max-h-[350px] overflow-auto border rounded shadow-lg bg-white">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  editor?.commands.insertContent(emoji.native);
                  setShowEmojiPicker(false);
                }}
                theme="light"
                previewPosition="none"
              />
            </div>
          </div>
        )}

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

        <button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.commands.setImage({ src: url });
          }}
          className="px-2 py-1 border rounded bg-white"
        >
          Insert Image (URL)
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-2 py-1 border rounded bg-white"
        >
          Upload Image
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleLocalImageUpload}
          className="hidden"
        />
      </div>

      <EditorContent editor={editor} className="border p-2 rounded" />
    </div>
  );
};
