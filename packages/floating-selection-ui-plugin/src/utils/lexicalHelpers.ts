import { $getSelection, type LexicalEditor } from "lexical";

/**
 * Gets the coordinates of the selection in the Lexical editor.
 * Copied from @mdxeditor/editor for positioning floating UI.
 */
export function getSelectionRectangle(editor: LexicalEditor) {
  const selection = $getSelection();
  const nativeSelection = window.getSelection();
  const activeElement = document.activeElement;

  const rootElement = editor.getRootElement();

  if (
    selection !== null &&
    nativeSelection !== null &&
    rootElement !== null &&
    rootElement.contains(nativeSelection.anchorNode) &&
    editor.isEditable()
  ) {
    const domRange = nativeSelection.getRangeAt(0);
    let rect;

    if (nativeSelection.isCollapsed) {
      let node = nativeSelection.anchorNode;
      if (node?.nodeType == 3) {
        node = node.parentNode;
      }
      rect = (node as HTMLElement).getBoundingClientRect();
      rect.width = 0;
    } else {
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }
    }
    return {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  } else if (!activeElement || activeElement.className !== "link-input") {
    return null;
  }
  return null;
}
