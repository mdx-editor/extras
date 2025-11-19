import type { LexicalEditor } from "lexical";
import type { ComponentType } from "react";

export interface FloatingSelectionUIPluginParams {
  /**
   * The React component to render in the floating UI
   */
  component: ComponentType<FloatingUIComponentProps>;

  /**
   * Hook to control when floating UI should be shown
   * @param editor - The Lexical editor instance
   * @returns true to show UI, false to hide
   */
  shouldShow?: (editor: LexicalEditor) => boolean;
}

export interface FloatingUIComponentProps {
  /**
   * The Lexical editor instance
   */
  editor: LexicalEditor;

  /**
   * Close the floating UI programmatically
   */
  close: () => void;
}

export interface SelectionRectangle {
  top: number;
  left: number;
  width: number;
  height: number;
}
