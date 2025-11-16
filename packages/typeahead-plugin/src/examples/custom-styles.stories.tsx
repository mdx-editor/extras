import type { Story } from "@ladle/react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { typeaheadPlugin } from "..";

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

const mockTags = [
  "feature",
  "bug",
  "documentation",
  "enhancement",
  "question",
  "urgent",
  "wontfix",
];

/**
 * Example with custom CSS classes (Tailwind-style)
 */
export const CustomClasses: Story = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <style>{`
        /* Custom styles using class names */
        .custom-mention-node {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
        }

        .custom-tag-node {
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .custom-menu {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 8px;
          min-width: 200px;
        }

        .custom-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .custom-menu-item {
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
          margin: 2px 0;
        }

        .custom-menu-item:hover {
          background: #f3f4f6;
        }

        .custom-menu-item-selected {
          background: #dbeafe;
          color: #1e40af;
        }
      `}</style>

      <h1>Custom Styling Example</h1>
      <p>
        This example demonstrates custom styling using CSS classes without
        importing the default styles.
      </p>
      <p>
        Try typing <code>@alice</code> or <code>#feature</code>
      </p>

      <div style={{ marginTop: "2rem" }}>
        <MDXEditor
          markdown="Hey @alice, can you check the #bug report?"
          plugins={[
            typeaheadPlugin({
              configs: [
                {
                  type: "mention",
                  trigger: "@",
                  nodeClassName: "custom-mention-node",
                  menuClassName: "custom-menu",
                  menuItemClassName: "custom-menu-item",
                  menuItemSelectedClassName: "custom-menu-item-selected",
                  searchCallback: (query: string) => {
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
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                  type: "tag",
                  trigger: "#",
                  nodeClassName: "custom-tag-node",
                  menuClassName: "custom-menu",
                  menuItemClassName: "custom-menu-item",
                  menuItemSelectedClassName: "custom-menu-item-selected",
                  searchCallback: (query: string) => {
                    return Promise.resolve(
                      mockTags.filter((tag) =>
                        tag.toLowerCase().includes(query.toLowerCase()),
                      ),
                    );
                  },
                  renderMenuItem: (tag: string) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          marginRight: "8px",
                          fontSize: "16px",
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
          <strong>Customization approach:</strong>
        </p>
        <ul>
          <li>
            <code>nodeClassName</code> - Custom CSS for the inserted node
          </li>
          <li>
            <code>menuClassName</code> - Custom CSS for the menu container
          </li>
          <li>
            <code>menuItemClassName</code> - Custom CSS for menu items
          </li>
          <li>
            <code>menuItemSelectedClassName</code> - Custom CSS for selected
            item
          </li>
        </ul>
      </div>
    </div>
  );
};

CustomClasses.meta = {
  title: "Custom Classes",
};

/**
 * Example with data attributes for styling
 */
export const DataAttributes: Story = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <style>{`
        /* Style using data attributes */
        [data-typeahead="true"] {
          padding: 3px 6px;
          border-radius: 6px;
          font-weight: 500;
        }

        [data-typeahead-type="mention"] {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        [data-typeahead-type="hashtag"] {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        [data-typeahead-menu="true"] {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 4px;
        }

        [data-typeahead-menu="true"] ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        [data-typeahead-item="true"] {
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          margin: 2px 0;
        }

        [data-typeahead-item="true"]:hover {
          background: #f9fafb;
        }

        [data-typeahead-item="true"][data-selected="true"] {
          background: #eff6ff;
          color: #1e40af;
        }
      `}</style>

      <h1>Data Attributes Styling</h1>
      <p>
        This example demonstrates styling using data attributes instead of class
        names.
      </p>
      <p>
        Try typing <code>@bob</code> or <code>#urgent</code>
      </p>

      <div style={{ marginTop: "2rem" }}>
        <MDXEditor
          markdown="Attention @bob, this is an #urgent matter!"
          plugins={[
            typeaheadPlugin({
              configs: [
                {
                  type: "mention",
                  trigger: "@",
                  searchCallback: (query: string) => {
                    return Promise.resolve(
                      mockUsers.filter((user) =>
                        user.toLowerCase().includes(query.toLowerCase()),
                      ),
                    );
                  },
                  renderMenuItem: (user: string) => <div>@{user}</div>,
                  maxResults: 5,
                },
                {
                  type: "hashtag",
                  trigger: "#",
                  searchCallback: (query: string) => {
                    return Promise.resolve(
                      mockTags.filter((tag) =>
                        tag.toLowerCase().includes(query.toLowerCase()),
                      ),
                    );
                  },
                  renderMenuItem: (tag: string) => <div>#{tag}</div>,
                  maxResults: 5,
                },
              ],
            }),
          ]}
        />
      </div>

      <div style={{ marginTop: "2rem", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Available data attributes:</strong>
        </p>
        <ul>
          <li>
            <code>[data-typeahead="true"]</code> - All typeahead nodes
          </li>
          <li>
            <code>[data-typeahead-type="..."]</code> - Specific typeahead type
          </li>
          <li>
            <code>[data-typeahead-menu="true"]</code> - Menu container
          </li>
          <li>
            <code>[data-typeahead-item="true"]</code> - Menu items
          </li>
          <li>
            <code>[data-selected="true"]</code> - Selected menu item
          </li>
        </ul>
      </div>
    </div>
  );
};

DataAttributes.meta = {
  title: "Data Attributes",
};
