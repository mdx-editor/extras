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

const mockHashtags = [
  "javascript",
  "typescript",
  "react",
  "nodejs",
  "python",
  "golang",
  "rust",
  "webdev",
  "coding",
  "programming",
];

/**
 * Multiple typeahead types example: @mentions and #hashtags
 */
export const MultipleTypes: Story = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>Multiple Typeahead Types Example</h1>
      <p>
        This example demonstrates multiple typeahead configurations working
        together.
      </p>
      <p>Try typing: @alice for mentions or #javascript for hashtags</p>
      <div style={{ marginTop: "2rem" }}>
        <MDXEditor
          markdown="Hey :mention[alice], check out this :hashtag[react] tutorial! :hashtag[typescript] is awesome too."
          plugins={[
            typeaheadPlugin({
              configs: [
                {
                  type: "mention",
                  trigger: "@",
                  searchCallback: async (query: string) => {
                    // Simulate async search
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve(
                          mockUsers.filter((user) =>
                            user.toLowerCase().includes(query.toLowerCase()),
                          ),
                        );
                      }, 100);
                    });
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
                {
                  type: "hashtag",
                  trigger: "#",
                  searchCallback: async (query: string) => {
                    // Simulate async search
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve(
                          mockHashtags.filter((tag) =>
                            tag.toLowerCase().includes(query.toLowerCase()),
                          ),
                        );
                      }, 100);
                    });
                  },
                  renderMenuItem: (tag: string) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          marginRight: "8px",
                          fontSize: "16px",
                          color: "#28a745",
                        }}
                      >
                        #
                      </span>
                      <span>{tag}</span>
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
          <li>Type # to trigger the hashtags menu</li>
          <li>Both triggers work independently</li>
          <li>Each type has its own search callback and rendering</li>
          <li>
            The content is serialized to MDAST as :mention[user] and
            :hashtag[tag]
          </li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          <strong>Note:</strong> This example uses the default styles imported
          from styles.css
        </p>
      </div>
    </div>
  );
};

MultipleTypes.meta = {
  title: "Multiple Types (Default Styles)",
};
