import type { Story } from "@ladle/react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { typeaheadPlugin, type TypeaheadEditorProps } from "..";
import "../styles.css";

interface User {
  name: string;
  avatar: string;
  email: string;
}

const mockUsers: User[] = [
  { name: "alice", avatar: "👩", email: "alice@example.com" },
  { name: "bob", avatar: "👨", email: "bob@example.com" },
  { name: "charlie", avatar: "🧑", email: "charlie@example.com" },
  { name: "diana", avatar: "👩‍🦰", email: "diana@example.com" },
  { name: "eve", avatar: "👱‍♀️", email: "eve@example.com" },
];

/**
 * Custom Editor Component with Avatar Chips
 * Demonstrates custom rendering using the Editor prop
 */
function UserMentionEditor({ node, descriptor }: TypeaheadEditorProps) {
  const username = node.getContent();
  const user = mockUsers.find((u) => u.name === username);
  const trigger = descriptor.trigger;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        backgroundColor: "#e3f2fd",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#1976d2",
        fontWeight: 500,
        cursor: "default",
      }}
      contentEditable={false}
      spellCheck={false}
    >
      <span style={{ fontSize: "16px" }}>{user?.avatar || "👤"}</span>
      <span>
        {trigger}
        {username}
      </span>
    </span>
  );
}

export const CustomAvatarEditor: Story = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Custom Editor with Avatars</h1>
      <p>
        Demonstrates custom rendering using the <code>Editor</code> prop.
      </p>
      <p>
        Type <code>@</code> to trigger the autocomplete menu and insert a
        mention with an avatar chip.
      </p>
      <div style={{ marginTop: "2rem", border: "1px solid #ccc" }}>
        <MDXEditor
          markdown="Hello :mention[alice], meet :mention[bob] and :mention[charlie]!"
          plugins={[
            typeaheadPlugin({
              configs: [
                {
                  type: "mention",
                  trigger: "@",
                  searchCallback: (query) => {
                    return Promise.resolve(
                      mockUsers
                        .filter((u) =>
                          u.name.toLowerCase().includes(query.toLowerCase()),
                        )
                        .map((u) => u.name),
                    );
                  },
                  renderMenuItem: (name) => {
                    const user = mockUsers.find((u) => u.name === name);
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>{user?.avatar}</span>
                        <span>{name}</span>
                      </div>
                    );
                  },
                  // Custom Editor prop for rendering in the editor
                  Editor: UserMentionEditor,
                },
              ],
            }),
          ]}
        />
      </div>
    </div>
  );
};

CustomAvatarEditor.meta = {
  title: "Custom Editor - Avatars",
};
