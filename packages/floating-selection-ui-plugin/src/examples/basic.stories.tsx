import type { Story } from "@ladle/react";
import {
  MDXEditor,
  listsPlugin,
  headingsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { $getSelection } from "lexical";
import { floatingSelectionUIPlugin } from "..";
import type { FloatingUIComponentProps } from "../types";

/**
 * Demo button component that logs selected text to console
 */
function DemoButton({ editor, close }: FloatingUIComponentProps) {
  return (
    <button
      style={{
        padding: "8px 16px",
        backgroundColor: "#007acc",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
      onClick={() => {
        const selectedText = editor.getEditorState().read(() => {
          const selection = $getSelection();
          return selection?.getTextContent() || "";
        });
        console.log("Selected text:", selectedText);
        close();
      }}
      onMouseDown={(e) => {
        // Prevent losing selection when clicking the button
        e.preventDefault();
      }}
    >
      Log Selection
    </button>
  );
}

/**
 * Basic example story for the Floating Selection UI Plugin
 */
export const BasicExample: Story = () => {
  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1>Floating Selection UI Plugin Demo</h1>
      <p>
        Select text in the editor below to see the floating UI appear above your
        selection.
      </p>
      <p>The button will log the selected text to the console.</p>

      <div
        style={{
          marginTop: "2rem",
          position: "absolute",
          top: "200px",
          left: "200px",
          right: "50px",
        }}
      >
        <MDXEditor
          onChange={(md) => {
            console.log("Markdown changed:", md);
          }}
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

Open your browser console (F12) to see the logged selections.`}
          plugins={[
            listsPlugin(),
            headingsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            floatingSelectionUIPlugin({
              component: DemoButton,
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

BasicExample.meta = {
  title: "Basic Example",
};

/**
 * Example without shouldShow hook - always shows when text is selected
 */
export const AlwaysShow: Story = () => {
  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1>Always Show Example</h1>
      <p>
        This example shows the floating UI for any text selection, no matter how
        short.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <MDXEditor
          markdown={`# Select Any Text

Even single characters will trigger the floating UI in this example.

Try selecting just one letter!`}
          plugins={[
            listsPlugin(),
            headingsPlugin(),
            floatingSelectionUIPlugin({
              component: DemoButton,
              // No shouldShow hook - always shows when text is selected
            }),
          ]}
        />
      </div>
    </div>
  );
};

AlwaysShow.meta = {
  title: "Always Show",
};
