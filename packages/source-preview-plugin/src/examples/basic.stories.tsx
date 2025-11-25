import type { Story } from "@ladle/react";
import {
  codeBlockPlugin,
  codeMirrorPlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  MDXEditorMethods,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import * as monaco from "monaco-editor";
import { useRef } from "react";
import { sourceWithPreviewPlugin } from "..";

import { basicDark } from "cm6-theme-basic-dark";
import { basicLight } from "cm6-theme-basic-light";
import "./dark-theme.css";
import { MonacoSourceEditorWithRef } from "./MonacoSourceEditor";
import sampleContent from "./sample-content.md?raw";
import { useDocumentTheme } from "./useDocumentTheme";
import { MonacoDiffEditor } from "./MonacoDiffEditor";

export const Welcome: Story = () => {
  const ref = useRef<MDXEditorMethods>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const theme = useDocumentTheme();

  return (
    <div className="App">
      <MDXEditor
        className="support-dark-mode"
        ref={ref}
        onChange={(md) => {
          void md;
          // console.log("change", md);
        }}
        markdown={sampleContent}
        plugins={[
          listsPlugin(),
          headingsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          thematicBreakPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              txt: "Plain Text",
              tsx: "TypeScript",
              "": "Unspecified",
              bash: "Shell",
            },
            codeMirrorExtensions: theme === "dark" ? [basicDark] : [basicLight],
          }),
          sourceWithPreviewPlugin({
            viewMode: "source",
            editor: ({ defaultValue, onChange, error }) => (
              <MonacoSourceEditorWithRef
                defaultValue={defaultValue}
                onChange={onChange}
                error={error}
                onEditorMount={(editor) => {
                  monacoRef.current = editor;
                }}
              />
            ),
            originalMarkdown: "# hello world",
            diffEditor: MonacoDiffEditor,
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper
                options={["source", "rich-text", "diff"]}
                SourceToolbar={
                  <div>
                    <button
                      onClick={() => {
                        const editor = monacoRef.current;
                        if (!editor) return;

                        const selection = editor.getSelection();
                        if (!selection) return;

                        const selectedText = editor
                          .getModel()
                          ?.getValueInRange(selection);
                        if (!selectedText) return;

                        const boldText = `**${selectedText}**`;
                        editor.executeEdits("bold-button", [
                          {
                            range: selection,
                            text: boldText,
                          },
                        ]);

                        // Move cursor after the bold text
                        const newPosition = {
                          lineNumber: selection.endLineNumber,
                          column: selection.endColumn + 4,
                        };
                        editor.setPosition(newPosition);
                        editor.focus();
                      }}
                    >
                      Bold!
                    </button>
                  </div>
                }
              >
                Hi!
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    </div>
  );
};

Welcome.meta = {
  title: "Welcome",
};
