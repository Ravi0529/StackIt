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
import Image from "@tiptap/extension-image";
import { CharacterCount } from "@tiptap/extensions";
import lowlight from "@/utils/lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "./CodeBlockComponent";
import { Toggle } from "../ui/toggle";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  ChevronDown,
  Heading as HeadingIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Highlighter,
  Link as LinkIcon,
  Unlink,
  Code,
  List,
  ListOrdered,
  ImageUp,
  FileImage,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";

const headingLevels = [
  { label: "H1", level: 1, icon: Heading1 },
  { label: "H2", level: 2, icon: Heading2 },
  { label: "H3", level: 3, icon: Heading3 },
];

const limit = 500;

interface TiptapProps {
  content?: string;
  onChange: (content: string) => void;
}

export const Tiptap: React.FC<TiptapProps> = ({
  onChange,
  content: initialContent,
}) => {
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
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: { class: "my-custom-highlight" },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-400 underline",
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
      CharacterCount.configure({
        limit,
      }),
    ],
    content: initialContent,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false,
  });

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAddLink = () => {
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
    setUrl("");
    setOpen(false);
  };

  const handleAddImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setOpen(false);
    }
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
      {!editor ? (
        <div>Loading editor...</div>
      ) : (
        <>
          <div className="toolbar flex flex-wrap gap-2 justify-center">
            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
          ${
            editor?.isActive("bold")
              ? "bg-black"
              : "bg-black/10 hover:bg-black/20"
          }`}
            >
              <BoldIcon className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
          ${
            editor?.isActive("italic")
              ? "bg-black"
              : "bg-black/10 hover:bg-black/20"
          }`}
            >
              <ItalicIcon className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
          ${
            editor?.isActive("underline")
              ? "bg-black"
              : "bg-black/10 hover:bg-black/20"
          }`}
            >
              <UnderlineIcon className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
          ${
            editor?.isActive("strike")
              ? "bg-black"
              : "bg-black/10 hover:bg-black/20"
          }`}
            >
              <Strikethrough className="w-4 h-4" />
            </Toggle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="px-3 py-1 border border-zinc-700 text-white bg-black/10 hover:bg-black/20"
                >
                  <HeadingIcon className="w-4 h-4" />
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700 text-white">
                {headingLevels.map(({ level, icon: Icon }) => (
                  <DropdownMenuItem
                    key={level}
                    onClick={() =>
                      editor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: level as 1 | 2 | 3 })
                        .run()
                    }
                    className="cursor-pointer"
                  >
                    {editor?.isActive("heading", { level }) && (
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                    )}
                    <Icon className="w-4 h-4" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
          ${
            editor?.isActive("horizontalRule")
              ? "bg-black"
              : "bg-black/10 hover:bg-black/20"
          }`}
            >
              <Minus className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleHighlight().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
          ${
            editor?.isActive("highlight")
              ? "bg-black"
              : "bg-black/10 hover:bg-black/20"
          }`}
            >
              <Highlighter className="w-4 h-4" />
            </Toggle>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Toggle
                  type="button"
                  className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
            ${
              editor?.isActive("link")
                ? "bg-black"
                : "bg-black/10 hover:bg-black/20"
            }`}
                >
                  <LinkIcon className="w-4 h-4" />
                </Toggle>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-zinc-900 text-white border-zinc-700">
                <AlertDialogHeader>
                  <AlertDialogTitle>Enter a URL</AlertDialogTitle>
                </AlertDialogHeader>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-zinc-800 border-zinc-600 text-white"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setUrl("");
                    }}
                    className="bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleAddLink}
                    className="bg-zinc-100 hover:bg-zinc-200 text-black"
                  >
                    Add Link
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().unsetLink().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
            ${
              editor?.isActive("link")
                ? "bg-black"
                : "bg-black/10 hover:bg-black/20"
            }`}
            >
              <Unlink className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
            ${
              editor?.isActive("codeBlock")
                ? "bg-black"
                : "bg-black/10 hover:bg-black/20"
            }`}
            >
              <Code className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
            ${
              editor?.isActive("bulletList")
                ? "bg-black"
                : "bg-black/10 hover:bg-black/20"
            }`}
            >
              <List className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
            ${
              editor?.isActive("orderedList")
                ? "bg-black"
                : "bg-black/10 hover:bg-black/20"
            }`}
            >
              <ListOrdered className="w-4 h-4" />
            </Toggle>

            <Toggle
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
            ${
              editor?.isActive("image")
                ? "bg-black"
                : "bg-black/10 hover:bg-black/20"
            }`}
            >
              Add <ImageUp className="w-4 h-4" />
            </Toggle>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLocalImageUpload}
              className="hidden"
            />

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Toggle
                  type="button"
                  className={`px-2 py-1 border rounded border-zinc-700 text-white transition-colors duration-200
            ${
              editor?.isActive("image")
                ? "bg-black"
                : "bg-black/10 hover:bg-black/20"
            }`}
                >
                  Link <FileImage className="w-4 h-4" />
                </Toggle>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-zinc-900 text-white border-zinc-700">
                <AlertDialogHeader>
                  <AlertDialogTitle>Enter an image URL</AlertDialogTitle>
                </AlertDialogHeader>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-zinc-800 border-zinc-600 text-white"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setImageUrl("");
                    }}
                    className="bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleAddImage}
                    className="bg-zinc-100 hover:bg-zinc-200 text-black"
                  >
                    Add Image
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <EditorContent
            editor={editor}
            className="border p-3 md:p-7 rounded"
          />

          {editor && (
            <div
              className={`text-sm text-right ${
                editor.storage.characterCount.characters() > limit - 20
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {editor.storage.characterCount.characters()}/{limit} characters
              &nbsp; | &nbsp;
              {editor.storage.characterCount.words()} words
            </div>
          )}
        </>
      )}
    </div>
  );
};
