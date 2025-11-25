import { DiffEditor } from "@monaco-editor/react";
import { useRef } from "react";
import { DiffEditorProps } from "../SourceWithPreviewWrapper";
import { useDocumentTheme } from "./useDocumentTheme";

/**
 * Monaco DiffEditor component using @monaco-editor/react
 */
export const MonacoDiffEditor: React.FC<DiffEditorProps> = ({
  original,
  modified,
  onChange,
  error,
}) => {
  const theme = useDocumentTheme();
  const ignoreChangeRef = useRef(false);

  return (
    <div style={{ paddingTop: "2rem" }}>
      <DiffEditor
        height="600px"
        language="markdown"
        original={original}
        modified={modified}
        theme={theme === "dark" ? "vs-dark" : "vs"}
        onMount={(editor) => {
          // Set the modified editor as editable
          const modifiedEditor = editor.getModifiedEditor();

          modifiedEditor.onDidChangeModelContent(() => {
            if (!ignoreChangeRef.current) {
              const model = modifiedEditor.getModel();
              if (model) {
                onChange(model.getValue());
              }
            }
          });
        }}
        options={{
          readOnly: false,
          renderSideBySide: true,
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          originalEditable: false,
        }}
      />
      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <p>{error.error}.</p>
        </div>
      )}
    </div>
  );
};
