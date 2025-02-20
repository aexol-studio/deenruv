import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import { useEffect } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { cn } from '@/lib/utils';
import React from 'react';
import { ErrorMessage } from '@/components/molecules';

const extensions = [StarterKit, Document, Paragraph, Text, Heading];

interface RichTextEditorProps {
    content: string | undefined;
    onContentChanged: (content: string) => void;
    errors?: string[];
    disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    content,
    onContentChanged,
    errors,
    disabled,
}) => {
    const editor = useEditor({
        extensions: extensions,
        content: content,
        onUpdate: ({ editor }) => onContentChanged(editor.getHTML()),
        editorProps: {
            attributes: {
                class: cn(
                    'min-h-32 max-h-64 overflow-auto focus-visible:outline-none',
                    'prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc',
                ),
            },
        },
        editable: !disabled,
    });

    useEffect(() => {
        if (editor && content && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <>
            <div className="flex w-full flex-col gap-3 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:placeholder:text-stone-400">
                <EditorToolbar editor={editor} />
                <EditorContent editor={editor} />
            </div>
            <ErrorMessage errors={errors} />
        </>
    );
};
