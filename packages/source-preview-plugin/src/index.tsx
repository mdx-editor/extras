import {
  addEditorWrapper$,
  realmPlugin,
  rootEditor$,
  ViewMode,
  viewMode$,
} from "@mdxeditor/editor";
import { filter, withLatestFrom } from "@mdxeditor/gurx";
import {
  sourceEditor$,
  SourceEditor,
  SourceWithPreviewWrapper,
  diffEditor$,
  originalMarkdown$,
  DiffEditor,
} from "./SourceWithPreviewWrapper";
export type {
  SourceEditor,
  SourceEditorProps,
  DiffEditor,
  DiffEditorProps,
} from "./SourceWithPreviewWrapper";

/**
 * @group Diff/Source
 */
export const sourceWithPreviewPlugin = realmPlugin<{
  /**
   * The initial view mode of the editor.
   * @default 'rich-text'
   */
  viewMode?: ViewMode;
  /**
   * the component used to edit the source code.
   */
  editor: SourceEditor;
  /**
   * the component used to display the diff view.
   */
  diffEditor?: DiffEditor;
  /**
   * the original markdown content for diff comparison.
   */
  originalMarkdown?: string;
}>({
  init(r, params) {
    r.sub(r.pipe(viewMode$, withLatestFrom(rootEditor$)), ([mode, editor]) => {
      editor?.setEditable(mode !== "source" && mode !== "diff");
    });

    // make the initial editor non-editable if starting in source or diff mode
    if (params?.viewMode === "source" || params?.viewMode === "diff") {
      const unsub = r.sub(
        r.pipe(
          rootEditor$,
          filter((editor) => editor !== null),
        ),
        (editor) => {
          editor?.setEditable(false);
          unsub();
        },
      );
    }

    r.pubIn({
      [viewMode$]: params?.viewMode ?? "rich-text",
      [addEditorWrapper$]: SourceWithPreviewWrapper,
      ...(params?.editor ? { [sourceEditor$]: params.editor } : {}),
      ...(params?.diffEditor ? { [diffEditor$]: params.diffEditor } : {}),
      ...(params?.originalMarkdown
        ? { [originalMarkdown$]: params.originalMarkdown }
        : {}),
    });
  },
});
