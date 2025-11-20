import {
  markdown$,
  markdownSourceEditorValue$,
  setMarkdown$,
  viewMode$,
  markdownProcessingError$,
} from "@mdxeditor/editor";
import {
  Cell,
  NodeRef,
  Signal,
  useCellValues,
  usePublisher,
} from "@mdxeditor/gurx";
import React from "react";

export interface SourceEditorProps {
  defaultValue: string;
  onChange: (value: string) => void;
  error: typeof markdownProcessingError$ extends NodeRef<infer U> ? U : never;
}

export type SourceEditor = React.FC<SourceEditorProps>;

export interface DiffEditorProps {
  original: string;
  modified: string;
  onChange: (value: string) => void;
  error: typeof markdownProcessingError$ extends NodeRef<infer U> ? U : never;
}

export type DiffEditor = React.FC<DiffEditorProps>;

export const sourceEditor$ = Cell<SourceEditor>(() => {
  return (
    <div>
      Pass <code>editor</code> parameter to <code>sourceWithPreviewPlugin</code>{" "}
      to enable source editing.
    </div>
  );
});

export const diffEditor$ = Cell<DiffEditor>(() => {
  return (
    <div>
      Pass <code>diffEditor</code> parameter to{" "}
      <code>sourceWithPreviewPlugin</code> to enable diff mode.
    </div>
  );
});

export const originalMarkdown$ = Cell<string>("");

// the built-in source editor did not have to update the markdown (there was no preview)
const updateBothSourceAndMarkdown$ = Signal<string>((r) => {
  r.link(updateBothSourceAndMarkdown$, setMarkdown$);
  r.link(updateBothSourceAndMarkdown$, markdownSourceEditorValue$);
});

export const SourceWithPreviewWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [
    viewMode,
    markdown,
    SourceEditorComponent,
    DiffEditorComponent,
    originalMarkdown,
    error,
  ] = useCellValues(
    viewMode$,
    markdown$,
    sourceEditor$,
    diffEditor$,
    originalMarkdown$,
    markdownProcessingError$,
  );

  const updateMarkdown = usePublisher(updateBothSourceAndMarkdown$);

  // Diff mode shows ONLY the diff editor (no preview)
  if (viewMode === "diff") {
    return (
      <DiffEditorComponent
        original={originalMarkdown}
        modified={markdown}
        onChange={updateMarkdown}
        error={error}
      />
    );
  }

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "stretch" }}>
      {viewMode === "source" && (
        <div style={{ width: "50%" }}>
          <SourceEditorComponent
            defaultValue={markdown}
            onChange={updateMarkdown}
            error={error}
          />
        </div>
      )}
      <div className="mdxeditor-rich-text-editor" style={{ width: "50%" }}>
        {children}
      </div>
    </div>
  );
};
