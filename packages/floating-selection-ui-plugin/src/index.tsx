import { addComposerChild$, realmPlugin } from "@mdxeditor/editor";
import { FloatingSelectionUI } from "./FloatingSelectionUI";
import type { FloatingSelectionUIPluginParams } from "./types";

export type {
  FloatingSelectionUIPluginParams,
  FloatingUIComponentProps,
  SelectionRectangle,
} from "./types";

/**
 * MDXEditor plugin for displaying customizable floating UI when text is selected.
 *
 * Shows a developer-provided React component positioned above text selections,
 * with optional visibility control via the shouldShow hook.
 *
 * @example
 * ```tsx
 * const MyButton = ({ editor, close }) => (
 *   <button onClick={() => {
 *     console.log('Selected text:', editor.getEditorState().read(() => $getSelection()?.getTextContent()));
 *     close();
 *   }}>
 *     Format
 *   </button>
 * );
 *
 * const editor = (
 *   <MDXEditor
 *     markdown={initialMarkdown}
 *     plugins={[
 *       floatingSelectionUIPlugin({
 *         component: MyButton,
 *         shouldShow: (editor) => {
 *           // Only show when more than 3 characters are selected
 *           const text = editor.getEditorState().read(() => $getSelection()?.getTextContent() || '');
 *           return text.length > 3;
 *         }
 *       })
 *     ]}
 *   />
 * );
 * ```
 */
export const floatingSelectionUIPlugin =
  realmPlugin<FloatingSelectionUIPluginParams>({
    init(realm, params) {
      // Validate required params
      if (!params?.component) {
        throw new Error(
          "floatingSelectionUIPlugin requires a component parameter",
        );
      }

      // Add component to composer (like typeahead plugin)
      realm.pubIn({
        [addComposerChild$]: () => (
          <FloatingSelectionUI
            component={params.component}
            shouldShow={params.shouldShow}
          />
        ),
      });
    },
  });
