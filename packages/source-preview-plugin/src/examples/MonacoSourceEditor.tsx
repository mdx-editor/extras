import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useRef } from "react";
import { useDocumentTheme } from "./useDocumentTheme";

interface MonacoSourceEditorProps {
  defaultValue: string;
  onChange: (value: string) => void;
  error?: { error: string; source: string } | null;
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

export const MonacoSourceEditorWithRef = ({
  defaultValue,
  onChange,
  error,
  onEditorMount,
}: MonacoSourceEditorProps) => {
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const theme = useDocumentTheme();

  return (
    <div style={{ paddingTop: "2rem" }}>
      <div ref={editorContainerRef}>
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="markdown"
          defaultValue={defaultValue}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          onChange={(value) => {
            onChange(value ?? "");
          }}
          onMount={(editor) => {
            monacoRef.current = editor;
            onEditorMount?.(editor);

            const MAX_SOURCE_EDITOR_HEIGHT = 10000;

            // Update editor height to fit content
            const updateHeight = () => {
              const contentHeight = Math.min(
                MAX_SOURCE_EDITOR_HEIGHT,
                editor.getContentHeight(),
              );
              if (editorContainerRef.current) {
                editorContainerRef.current.style.height = `${String(contentHeight)}px`;
              }
              editor.layout();
            };

            editor.onDidContentSizeChange(updateHeight);
            updateHeight();
          }}
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            wordWrap: "on",
            fontSize: 14,
            fontFamily: "monospace",
            tabSize: 2,
            insertSpaces: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <p>{error.error}.</p>
        </div>
      )}
    </div>
  );
};
