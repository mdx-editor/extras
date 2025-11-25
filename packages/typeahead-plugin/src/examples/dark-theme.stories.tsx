import type { Story } from "@ladle/react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { typeaheadPlugin } from "..";
import "../styles.css";
import "./dark-theme.css";

const mockUsers = ["alice", "bob", "charlie", "david"];

export const DarkThemeDemo: Story = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginTop: "2rem", border: "1px solid black" }}>
        <MDXEditor
          className="support-dark-mode"
          markdown="Type @ to test"
          plugins={[
            typeaheadPlugin({
              configs: [
                {
                  type: "mention",
                  trigger: "@",
                  searchCallback: (query) => {
                    return Promise.resolve(
                      mockUsers.filter((user) =>
                        user.toLowerCase().includes(query.toLowerCase()),
                      ),
                    );
                  },
                  renderMenuItem: (user: string) => <div>@{user}</div>,
                },
              ],
            }),
          ]}
        />
      </div>
      <hr />
      <div style={{ marginTop: "2rem", fontSize: "14px", opacity: 0.8 }}>
        <p>
          <strong>Testing instructions:</strong>
        </p>
        <ul>
          <li>Click the theme switcher (moon/sun icon) in the bottom left</li>
          <li>Type @ to trigger the typeahead menu</li>
          <li>Verify menu background and text colors adapt to the theme</li>
          <li>Check that the menu remains readable in both themes</li>
        </ul>
      </div>
    </div>
  );
};

DarkThemeDemo.meta = {
  title: "Dark Theme",
};
