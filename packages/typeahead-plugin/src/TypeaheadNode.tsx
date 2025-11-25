import {
  $applyNodeReplacement,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import type { JSX } from "react";
import { useCellValue } from "@mdxeditor/gurx";
import { typeAheadDescriptors$ } from "./index";
import { DefaultTypeaheadEditor } from "./DefaultTypeaheadEditor";

export type SerializedTypeaheadNode = Spread<
  {
    typeaheadType: string;
    content: string;
    trigger: string;
    nodeClassName?: string;
  },
  SerializedLexicalNode
>;

function $convertTypeaheadElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const typeaheadType = domNode.getAttribute("data-lexical-typeahead-type");
  const content = domNode.getAttribute("data-lexical-typeahead-content");
  const trigger = domNode.getAttribute("data-lexical-typeahead-trigger");
  const nodeClassName = domNode.getAttribute("data-lexical-typeahead-class");

  if (typeaheadType !== null && trigger !== null) {
    const contentValue = content !== null ? content : textContent || "";
    const node = $createTypeaheadNode(
      typeaheadType,
      contentValue,
      trigger,
      nodeClassName ?? undefined,
    );
    return {
      node,
    };
  }

  return null;
}

/**
 * Wrapper component that looks up descriptor from Gurx and renders appropriate Editor
 */
function TypeaheadEditorWrapper({ node }: { node: TypeaheadNode }) {
  const descriptors = useCellValue(typeAheadDescriptors$);
  const descriptor = descriptors.get(node.getTypeaheadType());

  if (!descriptor) {
    throw new Error(`unknown typeahead type: ${node.getTypeaheadType()}`);
  }

  const EditorComponent = descriptor.Editor ?? DefaultTypeaheadEditor;
  return <EditorComponent descriptor={descriptor} node={node} />;
}

export class TypeaheadNode extends DecoratorNode<JSX.Element> {
  __typeaheadType: string;
  __content: string;
  __trigger: string;
  __nodeClassName?: string;

  static getType(): string {
    return "typeahead";
  }

  static clone(node: TypeaheadNode): TypeaheadNode {
    return new TypeaheadNode(
      node.__typeaheadType,
      node.__content,
      node.__trigger,
      node.__key,
      node.__nodeClassName,
    );
  }

  static importJSON(serializedNode: SerializedTypeaheadNode): TypeaheadNode {
    // Ignore unknown fields for forward compatibility
    return $createTypeaheadNode(
      serializedNode.typeaheadType,
      serializedNode.content,
      serializedNode.trigger,
      serializedNode.nodeClassName,
    );
  }

  constructor(
    typeaheadType: string,
    content: string,
    trigger: string,
    key?: NodeKey,
    nodeClassName?: string,
  ) {
    super(key);
    this.__typeaheadType = typeaheadType;
    this.__content = content;
    this.__trigger = trigger;
    this.__nodeClassName = nodeClassName;
  }

  decorate(): JSX.Element {
    return <TypeaheadEditorWrapper node={this} />;
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.setAttribute("data-typeahead", "true");
    span.setAttribute("data-typeahead-type", this.__typeaheadType);
    span.className = `typeahead typeahead-${this.__typeaheadType}`;
    if (this.__nodeClassName) {
      span.className += ` ${this.__nodeClassName}`;
    }
    return span;
  }

  // Always return false for DecoratorNode - React handles updates
  updateDOM(): boolean {
    return false;
  }

  exportJSON(): SerializedTypeaheadNode {
    return {
      ...super.exportJSON(),
      typeaheadType: this.__typeaheadType,
      content: this.__content,
      trigger: this.__trigger,
      nodeClassName: this.__nodeClassName,
      type: "typeahead",
      version: 1,
    };
  }

  getContent(): string {
    return this.__content;
  }

  getTrigger(): string {
    return this.__trigger;
  }

  getTypeaheadType(): string {
    return this.__typeaheadType;
  }

  getNodeClassName(): string | undefined {
    return this.__nodeClassName;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-typeahead")) {
          return null;
        }
        return {
          conversion: $convertTypeaheadElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-typeahead", "true");
    element.setAttribute("data-lexical-typeahead-type", this.__typeaheadType);
    element.setAttribute("data-lexical-typeahead-trigger", this.__trigger);
    element.setAttribute("data-lexical-typeahead-content", this.__content);
    if (this.__nodeClassName) {
      element.setAttribute(
        "data-lexical-typeahead-class",
        this.__nodeClassName,
      );
    }
    element.textContent = `${this.__trigger}${this.__content}`;
    return { element };
  }
}

export function $createTypeaheadNode(
  type: string,
  content: string,
  trigger: string,
  nodeClassName?: string,
): TypeaheadNode {
  const node = new TypeaheadNode(
    type,
    content,
    trigger,
    undefined, // key
    nodeClassName,
  );
  return $applyNodeReplacement(node);
}

export function $isTypeaheadNode(
  node: LexicalNode | null | undefined,
): node is TypeaheadNode {
  return node instanceof TypeaheadNode;
}
