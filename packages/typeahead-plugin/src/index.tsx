import {
  addComposerChild$,
  addExportVisitor$,
  addImportVisitor$,
  addLexicalNode$,
  addMdastExtension$,
  addSyntaxExtension$,
  addToMarkdownExtension$,
  type LexicalExportVisitor,
  type MdastImportVisitor,
  realmPlugin,
} from "@mdxeditor/editor";
import { type ElementNode } from "lexical";
import * as Mdast from "mdast";
import { type TextDirective } from "mdast-util-directive";

import {
  directiveFromMarkdown,
  directiveToMarkdown,
} from "mdast-util-directive";
import { directive } from "micromark-extension-directive";
import {
  $createTypeaheadNode,
  $isTypeaheadNode,
  TypeaheadNode,
} from "./TypeaheadNode";
import { TypeaheadPlugin } from "./TypeaheadPlugin";
import type { TypeaheadDescriptor, TypeaheadPluginParams } from "./types";
import { Cell } from "@mdxeditor/gurx";

export const typeAheadDescriptors$ = Cell(
  new Map<string, TypeaheadDescriptor<unknown>>(),
);

// Export types and helpers
export {
  $createTypeaheadNode,
  $isTypeaheadNode,
  TypeaheadNode,
} from "./TypeaheadNode";

export type {
  TypeaheadDescriptor,
  TypeaheadPluginParams,
  MenuRenderProps,
  MenuItemWrapperProps,
  TypeaheadEditorProps,
} from "./types";

export { DefaultTypeaheadEditor } from "./DefaultTypeaheadEditor";

function createMdastImportVisitor(
  configs: TypeaheadDescriptor<unknown>[],
): MdastImportVisitor<TextDirective> {
  const configsByType = new Map(configs.map((c) => [c.type, c]));

  return {
    testNode: (node) => {
      return node.type === "textDirective" && configsByType.has(node.name);
    },
    visitNode: ({ mdastNode, lexicalParent }) => {
      const configType = mdastNode.name;
      const config = configsByType.get(configType);
      if (!config) return;

      const content = (mdastNode.children[0] as Mdast.Text).value;

      (lexicalParent as ElementNode).append(
        $createTypeaheadNode(
          configType,
          content,
          config.trigger,
          config.nodeClassName,
        ),
      );
    },
    priority: 100,
  };
}

function createLexicalExportVisitor(
  configs: TypeaheadDescriptor<unknown>[],
): LexicalExportVisitor<TypeaheadNode, TextDirective> {
  const registeredTypes = new Set(configs.map((c) => c.type));

  return {
    testLexicalNode: $isTypeaheadNode,
    visitLexicalNode({ actions, lexicalNode, mdastParent }) {
      if (!registeredTypes.has(lexicalNode.__typeaheadType)) {
        return;
      }

      actions.appendToParent(mdastParent, {
        name: lexicalNode.__typeaheadType,
        type: "textDirective",
        children: [{ type: "text", value: lexicalNode.__content }],
      });
    },
    priority: 100,
  };
}

/**
 * MDXEditor plugin for flexible typeahead autocomplete functionality.
 *
 * Supports multiple simultaneous typeahead types (mentions, hashtags, etc.),
 * each with customizable trigger characters, data sources, and rendering.
 * All types share a single Lexical node type differentiated by their type identifier.
 *
 * @example
 * ```tsx
 * const editor = (
 *   <MDXEditor
 *     markdown={initialMarkdown}
 *     plugins={[
 *       typeaheadPlugin({
 *         configs: [
 *           {
 *             type: 'mention',
 *             trigger: '@',
 *             searchCallback: async (query) => {
 *               return users.filter(u => u.includes(query));
 *             },
 *             renderMenuItem: (user) => <span>@{user}</span>
 *           },
 *           {
 *             type: 'hashtag',
 *             trigger: '#',
 *             searchCallback: async (query) => {
 *               return tags.filter(t => t.includes(query));
 *             },
 *             renderMenuItem: (tag) => <span>#{tag}</span>
 *           }
 *         ]
 *       })
 *     ]}
 *   />
 * );
 * ```
 */
export const typeaheadPlugin = realmPlugin<TypeaheadPluginParams>({
  init: (realm, params) => {
    if (!params?.configs || params.configs.length === 0) {
      throw new Error("typeaheadPlugin requires at least one config");
    }

    const types = params.configs.map((c) => c.type);
    const uniqueTypes = new Set(types);
    if (types.length !== uniqueTypes.size) {
      throw new Error("typeaheadPlugin: config.type values must be unique");
    }

    // Publish descriptors to Gurx cell for Editor components
    const descriptorMap = new Map(params.configs.map((c) => [c.type, c]));

    realm.pubIn({
      [addLexicalNode$]: TypeaheadNode,
      [typeAheadDescriptors$]: descriptorMap,
      [addImportVisitor$]: createMdastImportVisitor(params.configs),
      [addExportVisitor$]: createLexicalExportVisitor(params.configs),
      [addComposerChild$]: () => <TypeaheadPlugin configs={params.configs} />,

      [addMdastExtension$]: directiveFromMarkdown(),
      [addSyntaxExtension$]: directive(),
      [addToMarkdownExtension$]: directiveToMarkdown(),
    });
  },
});
