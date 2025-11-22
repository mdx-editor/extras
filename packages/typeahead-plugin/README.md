# @mdxeditor/typeahead-plugin

A flexible typeahead/autocomplete plugin for MDXEditor that supports multiple simultaneous autocomplete features (mentions, hashtags, custom triggers) with full styling customization.

## Installation

```bash
npm install @mdxeditor/typeahead-plugin
# or
pnpm add @mdxeditor/typeahead-plugin
# or
yarn add @mdxeditor/typeahead-plugin
```

## Features

- **Multiple typeahead types** - Configure @mentions, #hashtags, :emoji, or any custom trigger
- **Style-agnostic** - No forced styles, bring your own CSS or component library
- **Flexible rendering** - Use default rendering, custom CSS classes, or custom render functions
- **Async-capable** - Search callbacks return Promises for async data fetching

## Usage

### Basic Example with Mentions

```tsx
import { MDXEditor } from "@mdxeditor/editor";
import { typeaheadPlugin } from "@mdxeditor/typeahead-plugin";

const users = ["Alice", "Bob", "Charlie", "David"];

function App() {
  return (
    <MDXEditor
      markdown="# Hello World"
      plugins={[
        typeaheadPlugin({
          configs: [
            {
              type: "mention",
              trigger: "@",
              searchCallback: async (query) => {
                return users.filter((user) =>
                  user.toLowerCase().includes(query.toLowerCase()),
                );
              },
              renderMenuItem: (user) => <span>@{user}</span>,
            },
          ],
        }),
      ]}
    />
  );
}
```

### Multiple Typeahead Types

```tsx
import { MDXEditor } from "@mdxeditor/editor";
import { typeaheadPlugin } from "@mdxeditor/typeahead-plugin";

const users = ["Alice", "Bob", "Charlie"];
const tags = ["important", "urgent", "feature", "bug"];
const emojis = ["smile", "heart", "rocket", "fire"];

function App() {
  return (
    <MDXEditor
      markdown="# Hello World"
      plugins={[
        typeaheadPlugin({
          configs: [
            {
              type: "mention",
              trigger: "@",
              searchCallback: async (query) => {
                return users.filter((user) =>
                  user.toLowerCase().includes(query.toLowerCase()),
                );
              },
              renderMenuItem: (user) => (
                <div style={{ padding: "4px 8px" }}>
                  <strong>@{user}</strong>
                </div>
              ),
              maxResults: 5,
            },
            {
              type: "hashtag",
              trigger: "#",
              searchCallback: async (query) => {
                return tags.filter((tag) =>
                  tag.toLowerCase().includes(query.toLowerCase()),
                );
              },
              renderMenuItem: (tag) => (
                <div style={{ padding: "4px 8px" }}>#{tag}</div>
              ),
              className: "hashtag-node",
            },
            {
              type: "emoji",
              trigger: ":",
              searchCallback: async (query) => {
                return emojis.filter((emoji) =>
                  emoji.toLowerCase().includes(query.toLowerCase()),
                );
              },
              renderMenuItem: (emoji) => (
                <div style={{ padding: "4px 8px" }}>:{emoji}:</div>
              ),
            },
          ],
        }),
      ]}
    />
  );
}
```

### With API Data Source

```tsx
import { MDXEditor } from "@mdxeditor/editor";
import { typeaheadPlugin } from "@mdxeditor/typeahead-plugin";

function App() {
  return (
    <MDXEditor
      markdown="# Hello World"
      plugins={[
        typeaheadPlugin({
          configs: [
            {
              type: "user",
              trigger: "@",
              searchCallback: async (query) => {
                const response = await fetch(
                  `/api/users/search?q=${encodeURIComponent(query)}`,
                );
                const users = await response.json();
                return users.map((u) => u.username);
              },
              renderMenuItem: (username) => (
                <div className="user-menu-item">
                  <span className="username">@{username}</span>
                </div>
              ),
              maxResults: 10,
            },
          ],
        }),
      ]}
    />
  );
}
```

## API

### Plugin Configuration

The plugin accepts a single parameter object:

```tsx
interface TypeaheadPluginParams {
  configs: TypeaheadConfig[];
}
```

### TypeaheadConfig

Each typeahead configuration has the following properties:

| Property                    | Type                                           | Required | Description                                                                                     |
| --------------------------- | ---------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `type`                      | `string`                                       | Yes      | Unique identifier for this typeahead type. Used as MDAST directive name (e.g., `:mention[...]`) |
| `trigger`                   | `string`                                       | Yes      | Trigger character(s) - e.g., `"@"`, `"#"`, `":"`                                                |
| `searchCallback`            | `(query: string) => Promise<string[]>`         | Yes      | Async function to resolve search results                                                        |
| `renderMenuItem`            | `(item: string) => JSX.Element`                | Yes      | Render function for menu items                                                                  |
| `Editor`                    | `React.ComponentType<TypeaheadEditorProps>`    | No       | Custom component for rendering typeahead nodes in the editor after insertion                    |
| `convertToId`               | `(item: T) => string`                          | No       | Converter function to extract string ID from complex items                                      |
| `maxResults`                | `number`                                       | No       | Max results to show (default: 5)                                                                |
| `nodeClassName`             | `string`                                       | No       | Custom CSS class for the typeahead node in the editor                                           |
| `menuClassName`             | `string`                                       | No       | Custom CSS class for the autocomplete menu container                                            |
| `menuItemClassName`         | `string`                                       | No       | Custom CSS class for menu items                                                                 |
| `menuItemSelectedClassName` | `string`                                       | No       | Custom CSS class for the selected menu item                                                     |
| `renderMenu`                | `(props: MenuRenderProps) => JSX.Element`      | No       | Custom menu container renderer                                                                  |
| `renderMenuItemWrapper`     | `(props: MenuItemWrapperProps) => JSX.Element` | No       | Custom menu item wrapper renderer                                                               |
| `loadingIndicator`          | `JSX.Element`                                  | No       | Custom loading indicator component to replace default "Loading..." text                         |

## How It Works

When you type a trigger character (e.g., `@`), the plugin:

1. Detects the trigger and activates the typeahead
2. Calls your `searchCallback` with the user's query
3. Displays matching results in an autocomplete menu
4. Inserts the selected item as a custom node in the editor
5. Exports to markdown as a text directive: `:mention[Alice]`, `:hashtag[important]`, etc.

### Markdown Persistence

The plugin uses [text directives](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444) syntax for markdown persistence:

- Input: Type `@Alice` and select from menu
- In Lexical: Stored as `TypeaheadNode` with `type: "mention"` and `content: "Alice"`
- In Markdown: Exported as `:mention[Alice]`

## Styling

The plugin is **unstyled by default**, giving you complete control over appearance. Choose the approach that fits your project:

### 1. Default Styles (Optional)

Import the included default styles for a quick start:

```tsx
import "@mdxeditor/typeahead-plugin/styles.css";
```

### 2. Custom CSS Classes

Add custom CSS classes to style different parts:

```tsx
typeaheadPlugin({
  configs: [
    {
      type: "mention",
      trigger: "@",
      // Style the inserted node in the editor
      nodeClassName: "my-mention-node",
      // Style the autocomplete menu
      menuClassName: "my-menu",
      // Style menu items
      menuItemClassName: "my-menu-item",
      // Style selected menu item
      menuItemSelectedClassName: "my-menu-item-selected",
      searchCallback: async (query) => fetchUsers(query),
      renderMenuItem: (user) => <div>{user}</div>,
    },
  ],
});
```

**Tailwind example:**

```tsx
nodeClassName: "bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold";
menuClassName: "bg-white border rounded-lg shadow-lg p-2";
menuItemClassName: "px-3 py-2 rounded hover:bg-gray-100";
menuItemSelectedClassName: "bg-blue-50 text-blue-700";
```

### 3. Data Attributes

Style using semantic data attributes:

```css
/* Style all typeahead nodes */
[data-typeahead="true"] {
  padding: 2px 6px;
  border-radius: 4px;
}

/* Style specific types */
[data-typeahead-type="mention"] {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

/* Style the menu */
[data-typeahead-menu="true"] {
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Style menu items */
[data-typeahead-item="true"]:hover {
  background: #f3f4f6;
}

[data-typeahead-item="true"][data-selected="true"] {
  background: #dbeafe;
}
```

### 4. Custom Render Functions

For complete control with component libraries like shadcn/ui:

```tsx
import { Command, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";

typeaheadPlugin({
  configs: [
    {
      type: "mention",
      trigger: "@",
      searchCallback: async (query) => fetchUsers(query),
      renderMenuItem: (user) => <UserAvatar user={user} />,
      // Custom menu renderer
      renderMenu: ({ children, className }) => (
        <Popover>
          <PopoverContent className={cn("w-[300px] p-0", className)}>
            <Command>{children}</Command>
          </PopoverContent>
        </Popover>
      ),
      // Custom item wrapper
      renderMenuItemWrapper: ({
        children,
        isSelected,
        onClick,
        onMouseEnter,
      }) => (
        <CommandItem
          className={isSelected ? "bg-accent" : ""}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
        >
          {children}
        </CommandItem>
      ),
    },
  ],
});
```

### 5. Custom Editor Rendering

Customize how typeahead nodes appear in the editor after insertion using the `Editor` prop:

```tsx
import { useCellValue } from "@mdxeditor/gurx";

typeaheadPlugin({
  configs: [
    {
      type: "mention",
      trigger: "@",
      searchCallback: async (query) => fetchUsers(query),
      renderMenuItem: (user) => <span>@{user}</span>,
      // Custom editor renderer
      Editor: ({ node, descriptor }) => {
        const content = node.getContent();
        return (
          <span className="mention-chip">
            <Avatar user={content} />
            {descriptor.trigger}
            {content}
          </span>
        );
      },
    },
  ],
});
```

The `Editor` component receives:

- `node` - The TypeaheadNode instance with methods like `getContent()`, `getTrigger()`, `getTypeaheadType()`
- `descriptor` - The full descriptor config for this typeahead type

**Example with rich user data:**

```tsx
interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

typeaheadPlugin({
  configs: [
    {
      type: "mention",
      trigger: "@",
      searchCallback: async (query) => {
        const response = await fetch(`/api/users?q=${query}`);
        return await response.json();
      },
      renderMenuItem: (user: User) => (
        <div className="flex items-center gap-2">
          <img src={user.avatarUrl} className="w-6 h-6 rounded-full" />
          <span>@{user.username}</span>
        </div>
      ),
      convertToId: (user: User) => user.username,
      // Render mentions with avatars in the editor
      Editor: ({ node }) => {
        const username = node.getContent();
        const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

        useEffect(() => {
          fetch(`/api/users/${username}`)
            .then((res) => res.json())
            .then((user) => setAvatarUrl(user.avatarUrl));
        }, [username]);

        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {avatarUrl && (
              <img src={avatarUrl} className="w-4 h-4 rounded-full" />
            )}
            @{username}
          </span>
        );
      },
    },
  ],
});
```

If `Editor` is not provided, a default renderer displays `trigger + content` with appropriate CSS classes.

## Peer Dependencies

This plugin requires:

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

## Contributing

This package is part of the [MDXEditor Extras](https://github.com/mdx-editor/extras) monorepo. See the main repository for contribution guidelines.

## License

MIT
