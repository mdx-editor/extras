import type { Story } from "@ladle/react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { TypeaheadConfig, typeaheadPlugin } from "..";
import "../styles.css"; // Import default styles for this example

interface UserObjec {
  name: string;
  id: string;
  email: string;
}

const mockUsers: UserObjec[] = [
  { name: "alice", id: "1", email: "alice@mdxEditor.dev" },
  { name: "bob", id: "2", email: "bob@mdxEditor.dev" },
  { name: "charlie", id: "3", email: "charlie@mdxEditor.dev" },
  { name: "david", id: "4", email: "david@mdxEditor.dev" },
  { name: "emma", id: "5", email: "emma@mdxEditor.dev" },
  { name: "frank", id: "6", email: "frank@mdxEditor.dev" },
  { name: "grace", id: "7", email: "grace@mdxEditor.dev" },
  { name: "henry", id: "8", email: "henry@mdxEditor.dev" },
];

const UserMention: TypeaheadConfig<UserObjec> = {
  type: "mention",
  trigger: "@",
  searchCallback: (query: string) => {
    // Filter users based on query
    return Promise.resolve(
      mockUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  },
  renderMenuItem: (user: UserObjec) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "8px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {user.name[0].toUpperCase()}
      </span>
      <span>{user.name}</span>
    </div>
  ),
  convertToId: (o: UserObjec) => {
    return o.email;
  },
  renderEditor: () => {
    return <></>;
  },
  maxResults: 5,
};

/**
 * Basic mentions example with @ trigger
 */
export const ComplexObjectMentions: Story = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>Complex Object Mentions Example</h1>
      <p>Type @ followed by a name to trigger the mentions autocomplete.</p>
      <p>Try typing: @alice or @bob</p>
      <div style={{ marginTop: "2rem" }}>
        <MDXEditor
          markdown="Hello :mention[alice], can you help :mention[bob] with the project?"
          plugins={[
            typeaheadPlugin({
              configs: [UserMention],
            }),
          ]}
        />
      </div>
      <div style={{ marginTop: "2rem", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Tips:</strong>
        </p>
        <ul>
          <li>Type @ to trigger the mentions menu</li>
          <li>Use arrow keys to navigate the menu</li>
          <li>Press Enter or click to select a mention</li>
          <li>The mention will be styled and saved as :mention[user]</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          <strong>Note:</strong> This example uses the default styles imported
          from styles.css
        </p>
      </div>
    </div>
  );
};

ComplexObjectMentions.meta = {
  title: "Complex-objects-Mentions (Default Styles)",
};
