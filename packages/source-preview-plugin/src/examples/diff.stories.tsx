import type { Story } from "@ladle/react";
import {
  MDXEditorMethods,
  MDXEditor,
  toolbarPlugin,
  DiffSourceToggleWrapper,
  listsPlugin,
  headingsPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useRef } from "react";
import { sourceWithPreviewPlugin } from "..";
import "./dark-theme.css";
import { MonacoDiffEditor } from "./MonacoDiffEditor";
import { MonacoSourceEditorWithRef } from "./MonacoSourceEditor";

const ORIGINAL_CONTENT = `# Original Document

This is the **original** content.

- Item 1
- Item 2
`;

const MODIFIED_CONTENT = `# Modified Document

This is the **modified** content with changes.

- Item 1
- Item 2
- Item 3 (new)
`;

/**
 * Diff mode example story for the Source Preview Plugin
 *
 * This demonstrates an editable diff editor where you can modify the "modified"
 * (right) side of the diff. The original (left) side remains read-only for comparison.
 */
export const DiffMode: Story = () => {
  const ref = useRef<MDXEditorMethods>(null);

  return (
    <div className="App">
      <h2 style={{ marginBottom: "1rem" }}>Editable Diff Mode Example</h2>
      <p style={{ marginBottom: "1rem" }}>
        The right side (modified) is editable. Try editing it to see the diff
        update.
      </p>
      <MDXEditor
        className="support-dark-mode"
        ref={ref}
        markdown={MODIFIED_CONTENT}
        plugins={[
          listsPlugin(),
          headingsPlugin(),
          sourceWithPreviewPlugin({
            viewMode: "diff",
            originalMarkdown: ORIGINAL_CONTENT,
            editor: ({ defaultValue, onChange, error }) => (
              <MonacoSourceEditorWithRef
                defaultValue={defaultValue}
                onChange={onChange}
                error={error}
              />
            ),
            diffEditor: MonacoDiffEditor,
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper
                options={["diff", "source", "rich-text"]}
              >
                Toggle Modes
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    </div>
  );
};

DiffMode.meta = {
  title: "Diff Mode Example",
};
