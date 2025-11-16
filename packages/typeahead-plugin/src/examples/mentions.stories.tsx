import type { Story } from "@ladle/react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { typeaheadPlugin } from "..";
import "../styles.css"; // Import default styles for this example

const mockUsers = [
  "alice",
  "bob",
  "charlie",
  "david",
  "emma",
  "frank",
  "grace",
  "henry",
];

/**
 * Basic mentions example with @ trigger
 */
export const Mentions: Story = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>Mentions Example</h1>
      <p>Type @ followed by a name to trigger the mentions autocomplete.</p>
      <p>Try typing: @alice or @bob</p>
      <div style={{ marginTop: "2rem" }}>
        <MDXEditor
          markdown="Hello :mention[alice], can you help :mention[bob] with the project?"
          plugins={[
            typeaheadPlugin({
              configs: [
                {
                  type: "mention",
                  trigger: "@",
                  searchCallback: (query: string) => {
                    // Filter users based on query
                    return Promise.resolve(
                      mockUsers.filter((user) =>
                        user.toLowerCase().includes(query.toLowerCase()),
                      ),
                    );
                  },
                  renderMenuItem: (user: string) => (
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
                        {user[0].toUpperCase()}
                      </span>
                      <span>{user}</span>
                    </div>
                  ),
                  maxResults: 5,
                },
              ],
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

Mentions.meta = {
  title: "Mentions (Default Styles)",
};
