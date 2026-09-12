import { useEffect, type ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { cn } from '@gamification/shared-utils/utils/cn';

type TycRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-slate-600 transition-colors',
        'hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40',
        active && 'bg-slate-200 text-slate-900',
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-slate-200" aria-hidden />;
}

export function TycRichEditor({
  value,
  onChange,
  placeholder = 'Empezar a escribir...',
  className,
}: TycRichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-700 underline underline-offset-2',
        },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: cn(
          'tyc-editor-content min-h-48 max-h-72 overflow-y-auto px-3.5 py-3',
          'text-sm leading-relaxed text-slate-800 outline-none',
          '[&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold',
          '[&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold',
          '[&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold',
          '[&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5',
          '[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5',
          '[&_a]:text-sky-700 [&_a]:underline',
          '[&_strong]:font-semibold',
        ),
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = editor.getHTML();
    const next = value || '';
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className={cn(
          'min-h-64 animate-pulse rounded-xl border border-[#C9D8EC] bg-[#F3F7FC]',
          className,
        )}
      />
    );
  }

  const characters = editor.storage.characterCount.characters() as number;
  const words = editor.storage.characterCount.words() as number;

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL del enlace', previous ?? 'https://');
    if (url === null) {
      return;
    }
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim() })
      .run();
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[#C9D8EC] bg-white',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-[#F8FAFC] px-2 py-1.5">
        <ToolbarButton
          label="Deshacer"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <i className="pi pi-replay text-sm" />
        </ToolbarButton>
        <ToolbarButton
          label="Rehacer"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <i className="pi pi-refresh text-sm" />
        </ToolbarButton>

        <ToolbarDivider />

        <label className="sr-only" htmlFor="tyc-heading">
          Estilo de texto
        </label>
        <select
          id="tyc-heading"
          className="h-8 max-w-28 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none"
          value={
            editor.isActive('heading', { level: 1 })
              ? 'h1'
              : editor.isActive('heading', { level: 2 })
                ? 'h2'
                : editor.isActive('heading', { level: 3 })
                  ? 'h3'
                  : 'p'
          }
          onChange={(event) => {
            const next = event.target.value;
            const chain = editor.chain().focus();
            if (next === 'p') {
              chain.setParagraph().run();
              return;
            }
            const level = Number(next.replace('h', '')) as 1 | 2 | 3;
            chain.toggleHeading({ level }).run();
          }}
        >
          <option value="p">Párrafo</option>
          <option value="h1">Título 1</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
        </select>

        <ToolbarDivider />

        <ToolbarButton
          label="Negrita"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="text-sm font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          label="Cursiva"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="text-sm italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label="Subrayado"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="text-sm underline">U</span>
        </ToolbarButton>
        <label className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-slate-100">
          <span className="sr-only">Color de texto</span>
          <i className="pi pi-palette text-sm text-slate-600" aria-hidden />
          <input
            type="color"
            className="absolute h-0 w-0 opacity-0"
            value={
              (editor.getAttributes('textStyle').color as string | undefined) ??
              '#1e293b'
            }
            onChange={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
          />
        </label>

        <ToolbarDivider />

        <ToolbarButton
          label="Alinear izquierda"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <i className="pi pi-align-left text-sm" />
        </ToolbarButton>
        <ToolbarButton
          label="Centrar"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <i className="pi pi-align-center text-sm" />
        </ToolbarButton>
        <ToolbarButton
          label="Alinear derecha"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <i className="pi pi-align-right text-sm" />
        </ToolbarButton>
        <ToolbarButton
          label="Justificar"
          active={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <i className="pi pi-align-justify text-sm" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Lista con viñetas"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <i className="pi pi-list text-sm" />
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <i className="pi pi-list-check text-sm" />
        </ToolbarButton>
        <ToolbarButton
          label="Enlace"
          active={editor.isActive('link')}
          onClick={setLink}
        >
          <i className="pi pi-link text-sm" />
        </ToolbarButton>
        <ToolbarButton
          label="Separador"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <i className="pi pi-minus text-sm" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-[11px] text-slate-500">
        <div className="flex gap-3">
          <span>Palabras: {words}</span>
          <span>Caracteres: {characters}</span>
        </div>
      </div>

      <style>{`
        .tyc-editor-content p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
