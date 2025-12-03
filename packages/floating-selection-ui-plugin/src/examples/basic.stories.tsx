import type { Story, StoryDefault } from "@ladle/react";
import {
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { $getSelection } from "lexical";
import React from "react";
import { floatingSelectionUIPlugin } from "..";

export default {
  title: "Get selection as markdown",
} satisfies StoryDefault;

export const GetSelectionAsMarkdown: Story = () => {
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null);
  return (
    <div className="App" style={{ padding: "2rem" }}>
      <div
        style={{ fontSize: "0.875rem", marginBottom: "1rem", color: "#444" }}
      >
        <h1>Floating Selection UI Plugin Demo</h1>
        <p>
          Select text in the editor below to see the floating UI appear above
          your selection.
        </p>
        <p>The button will log the selected text to the console.</p>

        <p>
          The absoltue position is to ensure the selection works as expected in
          more complicated cases.
        </p>
      </div>
      <div>
        <MDXEditor
          readOnly
          ref={mdxEditorRef}
          markdown={`# Welcome to MDXEditor

Select any text in this editor and a floating button will appear above your selection.

Try selecting this paragraph! The floating button will appear and when you click it, the selected text will be logged to your browser console.

## Features

- **Floating UI**: Appears above text selections
- **Customizable**: Pass your own React component
- **Flexible**: Control visibility with the shouldShow hook

You can select:
- Single words
- Multiple paragraphs
- Any text content

Open your browser console to see the logged selections.`}
          plugins={[
            listsPlugin(),
            headingsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            floatingSelectionUIPlugin({
              component: () => (
                <button
                  onClick={() => {
                    console.log(mdxEditorRef.current?.getSelectionMarkdown());
                  }}
                >
                  log current selection as markdown
                </button>
              ),
              align: "start",
              side: "top",
              // Only show when more than 3 characters are selected
              shouldShow: (editor) => {
                const text = editor.getEditorState().read(() => {
                  const selection = $getSelection();
                  return selection?.getTextContent() || "";
                });
                return text.length > 3;
              },
            }),
          ]}
        />
      </div>
    </div>
  );
};
