import React from "react";
import { SimpleButton, ToggleButton, ToggleGroupButton } from "./Buttons";
import { Button, Separator, ToggleGroup } from "@/components/atoms";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  rawMode: boolean;
  onRawModeChange: () => void;
}

export const EditorToolbar = ({
  editor,
  rawMode,
  onRawModeChange,
}: EditorToolbarProps) => {
  if (!editor || !editor.isEditable) {
    return null;
  }

  return (
    <div className="flex min-h-8 flex-wrap gap-1">
      {!rawMode && (
        <>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={20} />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={20} />
          </ToggleButton>
          <Separator orientation="vertical" />
          <ToggleGroup
            type="single"
            onValueChange={(v) =>
              v === "ordered"
                ? editor.chain().focus().toggleOrderedList().run()
                : editor.chain().focus().toggleBulletList().run()
            }
          >
            <ToggleGroupButton value="ordered">
              <ListOrdered size={20} />
            </ToggleGroupButton>
            <ToggleGroupButton value="bullet">
              <List size={20} />
            </ToggleGroupButton>
          </ToggleGroup>
          <Separator orientation="vertical" />
          <ToggleButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={20} />
          </ToggleButton>
          <Separator orientation="vertical" />
          <SimpleButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo size={20} />
          </SimpleButton>
          <SimpleButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo size={20} />
          </SimpleButton>
          <Separator orientation="vertical" />
          <ToggleGroup
            type="single"
            onValueChange={(e: string) =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: Number(e) as 1 | 2 | 3 | 4 | 5 | 6 })
                .run()
            }
          >
            <ToggleGroupButton value="1">
              <Heading1 size={20} />
            </ToggleGroupButton>
            <ToggleGroupButton value="2">
              <Heading2 size={20} />
            </ToggleGroupButton>
            <ToggleGroupButton value="3">
              <Heading3 size={20} />
            </ToggleGroupButton>
            <ToggleGroupButton value="4">
              <Heading4 size={20} />
            </ToggleGroupButton>
            <ToggleGroupButton value="5">
              <Heading5 size={20} />
            </ToggleGroupButton>
            <ToggleGroupButton value="6">
              <Heading6 size={20} />
            </ToggleGroupButton>
          </ToggleGroup>
          <Separator orientation="vertical" />
        </>
      )}
      <Button
        aria-pressed={rawMode}
        className="h-8 px-2 text-xs"
        onClick={onRawModeChange}
        title={rawMode ? "Wróć do edytora" : "Pokaż surowe dane HTML"}
        type="button"
        variant={rawMode ? "secondary" : "outline"}
      >
        Surowe dane
      </Button>
    </div>
  );
};
