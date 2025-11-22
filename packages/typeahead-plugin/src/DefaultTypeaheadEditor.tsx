import { useCellValue } from "@mdxeditor/gurx";
import type { TypeaheadEditorProps } from "./types";
import { typeAheadDescriptors$ } from "./index";

/**
 * Default editor component for typeahead nodes.
 * Renders a simple text representation matching the current TextNode behavior.
 * Used as fallback when no custom Editor is provided.
 */
export function DefaultTypeaheadEditor({ node }: TypeaheadEditorProps) {
  // Look up descriptor from Gurx cell
  const descriptors = useCellValue(typeAheadDescriptors$);
  const config = descriptors.get(node.getTypeaheadType());

  // Extract data from node using accessor methods
  const content = node.getContent();
  const type = node.getTypeaheadType();
  const trigger = config?.trigger ?? "";
  const customClassName = node.getNodeClassName();

  // Build CSS classes (matches current createDOM logic)
  const classes = ["typeahead", `typeahead-${type}`];
  if (customClassName) {
    classes.push(customClassName);
  }

  // Render simple text representation (matches current TextNode rendering)
  return (
    <span
      className={classes.join(" ")}
      data-typeahead="true"
      data-typeahead-type={type}
      contentEditable={false}
      spellCheck={false}
    >
      {trigger}
      {content}
    </span>
  );
}
