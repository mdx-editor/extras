import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
  TextNode,
} from "lexical";

export type SerializedTypeaheadNode = Spread<
  {
    typeaheadType: string;
    content: string;
    trigger: string;
    nodeClassName?: string;
  },
  SerializedTextNode
>;

function $convertTypeaheadElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const typeaheadType = domNode.getAttribute("data-lexical-typeahead-type");
  const content = domNode.getAttribute("data-lexical-typeahead-content");
  const trigger = domNode.getAttribute("data-lexical-typeahead-trigger");
  const nodeClassName = domNode.getAttribute("data-lexical-typeahead-class");

  if (typeaheadType !== null && trigger !== null && textContent) {
    const node = $createTypeaheadNode(
      typeaheadType,
      content ?? textContent,
      trigger,
      textContent,
      nodeClassName ?? undefined,
    );
    return {
      node,
    };
  }

  return null;
}

export class TypeaheadNode extends TextNode {
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
      node.__text,
      node.__key,
      node.__nodeClassName,
    );
  }

  static importJSON(serializedNode: SerializedTypeaheadNode): TypeaheadNode {
    return $createTypeaheadNode(
      serializedNode.typeaheadType,
      serializedNode.content,
      serializedNode.trigger,
      undefined,
      serializedNode.nodeClassName,
    ).updateFromJSON(serializedNode);
  }

  constructor(
    typeaheadType: string,
    content: string,
    trigger: string,
    text?: string,
    key?: NodeKey,
    nodeClassName?: string,
  ) {
    // Display trigger + content in the editor
    super(text ?? `${trigger}${content}`, key); // CRITICAL: Pass key to parent
    this.__typeaheadType = typeaheadType;
    this.__content = content;
    this.__trigger = trigger;
    this.__nodeClassName = nodeClassName;
  }

  exportJSON(): SerializedTypeaheadNode {
    return {
      ...super.exportJSON(),
      typeaheadType: this.__typeaheadType,
      content: this.__content,
      trigger: this.__trigger,
      nodeClassName: this.__nodeClassName,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    // Add data attributes for styling hooks
    dom.setAttribute("data-typeahead", "true");
    dom.setAttribute("data-typeahead-type", this.__typeaheadType);

    // Build class name
    const classes = ["typeahead", `typeahead-${this.__typeaheadType}`];
    if (this.__nodeClassName) {
      classes.push(this.__nodeClassName);
    }
    dom.className = classes.join(" ");
    dom.spellcheck = false;
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-typeahead", "true");
    element.setAttribute("data-lexical-typeahead-type", this.__typeaheadType);
    element.setAttribute("data-lexical-typeahead-trigger", this.__trigger);
    if (
      this.__text !== this.__content &&
      this.__text !== `${this.__trigger}${this.__content}`
    ) {
      element.setAttribute("data-lexical-typeahead-content", this.__content);
    }
    if (this.__nodeClassName) {
      element.setAttribute(
        "data-lexical-typeahead-class",
        this.__nodeClassName,
      );
    }
    element.textContent = this.__text;
    return { element };
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

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createTypeaheadNode(
  type: string,
  content: string,
  trigger: string,
  text?: string,
  nodeClassName?: string,
): TypeaheadNode {
  const node = new TypeaheadNode(
    type,
    content,
    trigger,
    text,
    undefined,
    nodeClassName,
  );
  // CRITICAL: Use segmented mode for proper editing
  node.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(node);
}

export function $isTypeaheadNode(
  node: LexicalNode | null | undefined,
): node is TypeaheadNode {
  return node instanceof TypeaheadNode;
}
