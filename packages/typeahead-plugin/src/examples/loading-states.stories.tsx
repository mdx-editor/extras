import type { Story } from "@ladle/react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { typeaheadPlugin } from "..";
import "../styles.css";

const mockUsers = ["alice", "bob", "charlie", "david"];

export const LoadingAndEmpty: Story = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Loading, Empty, and Error States</h1>
      <p>
        This example demonstrates all four states of the typeahead menu:
        loading, empty, error, and results.
      </p>
      <div style={{ marginTop: "2rem" }}>
        <MDXEditor
          markdown="Type @ to trigger the typeahead menu"
          plugins={[
            typeaheadPlugin({
              configs: [
                {
                  type: "mention",
                  trigger: "@",
                  searchCallback: async (query) => {
                    // Simulate slow API
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    // Return empty for "xyz"
                    if (query === "xyz") return [];
                    // Simulate error for "error"
                    if (query === "error") {
                      throw new Error("API error");
                    }
                    // Normal results for others
                    return mockUsers.filter((u) => u.includes(query));
                  },
                  renderMenuItem: (user: string) => <div>{user}</div>,
                  // Optional: custom loading indicator
                  loadingIndicator: <span>🔄 Loading...</span>,
                },
              ],
            }),
          ]}
        />
      </div>
      <div style={{ marginTop: "2rem", fontSize: "14px", opacity: 0.8 }}>
        <p>
          <strong>Test cases:</strong>
        </p>
        <ul>
          <li>
            Type <code>@a</code> - Shows loading indicator for 1.5s, then
            results
          </li>
          <li>
            Type <code>@xyz</code> - Shows loading, then "No results found"
          </li>
          <li>
            Type <code>@error</code> - Shows loading, then "Error loading
            results" in red
          </li>
          <li>
            Type <code>@alice</code> - Shows loading, then normal results
          </li>
          <li>
            Try keyboard navigation - arrow keys should skip loading/empty/error
            items
          </li>
          <li>
            Note the custom loading indicator (🔄 emoji) - this is configurable
            via the <code>loadingIndicator</code> prop
          </li>
        </ul>
      </div>
    </div>
  );
};

LoadingAndEmpty.meta = {
  title: "Loading & States",
};
