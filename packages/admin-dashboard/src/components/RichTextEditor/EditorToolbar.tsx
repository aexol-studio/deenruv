import { SimpleButton, ToggleButton, ToggleGroupButton } from '@/components/RichTextEditor/Buttons';
import { Separator, ToggleGroup } from '@deenruv/react-ui-devkit';
import { Editor } from '@tiptap/react';
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
} from 'lucide-react';
import { Stack } from '../Stack';

export const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <Stack className="min-h-8 gap-1">
      <ToggleButton onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={20} />
      </ToggleButton>
      <ToggleButton onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={20} />
      </ToggleButton>
      <Separator orientation="vertical" />
      <ToggleGroup
        type="single"
        onValueChange={(v) =>
          v === 'ordered'
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
      <ToggleButton onClick={() => editor.chain().focus().toggleBlockquote().run()}>
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
    </Stack>
  );
};
