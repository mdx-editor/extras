# @mdxeditor/floating-selection-ui-plugin

MDXEditor plugin for displaying customizable floating UI when text is selected. Shows a developer-provided React component positioned above text selections, similar to formatting toolbars in Dropbox Paper or Google Docs.

## Installation

```bash
npm install @mdxeditor/floating-selection-ui-plugin
```

```bash
pnpm add @mdxeditor/floating-selection-ui-plugin
```

## Features

- Floating UI appears above text selections
- Fully customizable React component
- Optional visibility control via `shouldShow` hook

## Usage

This plugin enables you to display any React component in a floating popover when users select text in the editor.

### Basic Example

```tsx
import { MDXEditor, listsPlugin, headingsPlugin } from "@mdxeditor/editor";
import { floatingSelectionUIPlugin } from "@mdxeditor/floating-selection-ui-plugin";
import type { FloatingUIComponentProps } from "@mdxeditor/floating-selection-ui-plugin";
import { $getSelection } from "lexical";

// Define your custom component
function FormatButton({ editor, close }: FloatingUIComponentProps) {
  return (
    <button
      onClick={() => {
        const selectedText = editor.getEditorState().read(() => {
          const selection = $getSelection();
          return selection?.getTextContent() || "";
        });
        console.log("Selected:", selectedText);
        close();
      }}
      onMouseDown={(e) => {
        // Prevent losing selection when clicking
        e.preventDefault();
      }}
    >
      Format
    </button>
  );
}

function App() {
  return (
    <MDXEditor
      markdown="# Hello World\n\nSelect some text!"
      plugins={[
        listsPlugin(),
        headingsPlugin(),
        floatingSelectionUIPlugin({
          component: FormatButton,
        }),
      ]}
    />
  );
}
```

### Advanced Example with Visibility Control

```tsx
import { MDXEditor } from "@mdxeditor/editor";
import { floatingSelectionUIPlugin } from "@mdxeditor/floating-selection-ui-plugin";
import type { FloatingUIComponentProps } from "@mdxeditor/floating-selection-ui-plugin";
import { $getSelection } from "lexical";

function FormattingToolbar({ editor, close }: FloatingUIComponentProps) {
  const handleBold = () => {
    // Your formatting logic here
    close();
  };

  return (
    <div style={{ display: "flex", gap: "4px", padding: "4px" }}>
      <button onClick={handleBold}>Bold</button>
      <button onClick={() => close()}>Italic</button>
      <button onClick={() => close()}>Link</button>
    </div>
  );
}

function App() {
  return (
    <MDXEditor
      markdown="# Hello World"
      plugins={[
        floatingSelectionUIPlugin({
          component: FormattingToolbar,
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
  );
}
```

### Custom Styled Component

```tsx
import type { FloatingUIComponentProps } from "@mdxeditor/floating-selection-ui-plugin";

function StyledToolbar({ editor, close }: FloatingUIComponentProps) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "8px",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        display: "flex",
        gap: "8px",
      }}
    >
      <button
        style={{
          padding: "4px 12px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          backgroundColor: "#007acc",
          color: "white",
        }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          // Your action here
          close();
        }}
      >
        Action
      </button>
    </div>
  );
}
```

## API

### Plugin Configuration

```tsx
floatingSelectionUIPlugin({
  component: ComponentType<FloatingUIComponentProps>,
  shouldShow?: (editor: LexicalEditor) => boolean
})
```

**Parameters:**

- **`component`** (required): A React component that will be rendered in the floating UI
- **`shouldShow`** (optional): A function that determines whether the floating UI should be shown. Receives the Lexical editor instance and returns a boolean. If not provided, the UI will show whenever text is selected.

### FloatingUIComponentProps Interface

Your component receives these props:

```tsx
interface FloatingUIComponentProps {
  editor: LexicalEditor; // The Lexical editor instance
  close: () => void; // Function to close the floating UI
}
```

**Usage tips:**

- Use `editor.getEditorState().read()` to read selection and content
- Call `close()` to hide the floating UI programmatically
- Add `onMouseDown={(e) => e.preventDefault()}` to buttons to prevent losing selection

## Important Notes

1. **Preventing Selection Loss**: When adding interactive elements (buttons, etc.), use `onMouseDown={(e) => e.preventDefault()}` to prevent the selection from being cleared when the user clicks.

2. **Reading Selection**: Always wrap selection reads in `editor.getEditorState().read()`:

   ```tsx
   const text = editor.getEditorState().read(() => {
     const selection = $getSelection();
     return selection?.getTextContent() || "";
   });
   ```

## Contributing

This package is part of the [MDXEditor Extras](https://github.com/mdx-editor/extras) monorepo. See the main repository for contribution guidelines.

## License

MIT
