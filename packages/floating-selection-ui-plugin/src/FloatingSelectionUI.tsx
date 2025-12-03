import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState, useRef } from "react";
import type {
  FloatingSelectionUIPluginParams,
  SelectionRectangle,
} from "./types";
import { getSelectionRectangle } from "./utils/lexicalHelpers";
import { editorRootElementRef$, useCellValue } from "@mdxeditor/editor";

export function FloatingSelectionUI({
  component: Component,
  shouldShow,
  side = "top",
  align = "center",
}: FloatingSelectionUIPluginParams) {
  const [editor] = useLexicalComposerContext();
  const editorRootElementRef = useCellValue(editorRootElementRef$);
  const [selectionRect, setSelectionRect] = useState<SelectionRectangle | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handlePointerDown = () => {
      isSelectingRef.current = true;
      setIsVisible(false);
    };

    const handlePointerUp = () => {
      isSelectingRef.current = false;

      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if (!selection || selection.isCollapsed()) {
          setSelectionRect(null);
          setIsVisible(false);
          return;
        }

        const rect = getSelectionRectangle(editor);
        if (!rect) {
          setIsVisible(false);
          return;
        }

        setSelectionRect(rect);

        const show = shouldShow ? shouldShow(editor) : true;
        setIsVisible(show);
      });
    };

    rootElement.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      rootElement.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [editor, shouldShow]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();

        if (!selection || selection.isCollapsed()) {
          setSelectionRect(null);
          setIsVisible(false);
          return false;
        }

        const rect = getSelectionRectangle(editor);
        if (!rect) {
          return false;
        }

        setSelectionRect(rect);

        if (!isSelectingRef.current) {
          const show = shouldShow ? shouldShow(editor) : true;
          setIsVisible(show);
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, shouldShow]);

  useEffect(() => {
    const updatePosition = () => {
      if (!isVisible) return;

      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!selection || selection.isCollapsed()) {
          setSelectionRect(null);
          setIsVisible(false);
          return;
        }

        const rect = getSelectionRectangle(editor);
        if (rect) {
          setSelectionRect(rect);
        }
      });
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [editor, isVisible]);

  if (!isVisible || !selectionRect) {
    return null;
  }

  return (
    <Popover.Root open={isVisible} modal={false}>
      <Popover.Anchor
        style={{
          position: "fixed",
          top: `${String(selectionRect.top)}px`,
          left: `${String(selectionRect.left)}px`,
          width: `${String(selectionRect.width)}px`,
          height: `${String(selectionRect.height)}px`,
          pointerEvents: "none",
        }}
      />

      <Popover.Portal container={editorRootElementRef?.current}>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={5}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <Component
            editor={editor}
            close={() => {
              setIsVisible(false);
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
