import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { TextNode } from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";

import { $createTypeaheadNode } from "./TypeaheadNode";
import type { TypeaheadDescriptor } from "./types";
import { editorWrapperElementRef$, useCellValue } from "@mdxeditor/editor";

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const VALID_CHARS = (trigger: string) =>
  "[^" + escapeRegex(trigger) + PUNCTUATION + "\\s]";
const LENGTH_LIMIT = 75;

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTriggerRegex(trigger: string): RegExp {
  const escapedTrigger = escapeRegex(trigger);
  return new RegExp(
    "(^|\\s|\\()(" +
      "[" +
      escapedTrigger +
      "]" +
      "((?:" +
      VALID_CHARS(trigger) +
      "){0," +
      String(LENGTH_LIMIT) +
      "})" +
      ")$",
  );
}

function checkForTriggerMatch(
  text: string,
  triggerRegex: RegExp,
  minMatchLength: number,
): MenuTextMatch | null {
  const match = triggerRegex.exec(text);
  if (match !== null) {
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

class TypeaheadOption<T> extends MenuOption {
  value: T;
  displayElement: JSX.Element;

  constructor(key: string, value: T, displayElement: JSX.Element) {
    super(key);
    this.value = value;
    this.displayElement = displayElement;
  }
}

function TypeaheadMenuItem<T>({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
  config,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: TypeaheadOption<T>;
  config: TypeaheadDescriptor<T>;
}) {
  const content = option.displayElement;

  // Use custom renderer if provided
  if (config.renderMenuItemWrapper) {
    const customWrapper = config.renderMenuItemWrapper({
      children: content,
      isSelected,
      onClick,
      onMouseEnter,
      index,
    });
    return (
      <div
        ref={(el) => {
          option.setRefElement(el);
        }}
        role="option"
        aria-selected={isSelected}
        id={`typeahead-item-${String(index)}`}
      >
        {customWrapper}
      </div>
    );
  }

  // Default rendering with custom class names
  const classes = ["item"];
  if (config.menuItemClassName) {
    classes.push(config.menuItemClassName);
  }
  if (isSelected) {
    classes.push("selected");
    if (config.menuItemSelectedClassName) {
      classes.push(config.menuItemSelectedClassName);
    }
  }

  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={classes.join(" ")}
      ref={(el) => {
        option.setRefElement(el);
      }}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${String(index)}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      data-typeahead-item="true"
      data-selected={isSelected}
    >
      {content}
    </li>
  );
}

function useTypeaheadSearch<T>(
  config: TypeaheadDescriptor<T>,
  queryString: string | null,
): { results: T[]; isLoading: boolean; hasError: boolean } {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (queryString == null) {
      setResults([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false); // Reset error on new search

    void config
      .searchCallback(queryString)
      .then((newResults) => {
        setResults(newResults);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Typeahead search callback error:", error);
        setResults([]);
        setIsLoading(false);
        setHasError(true);
      });
  }, [queryString, config]);

  return { results, isLoading, hasError };
}

function SingleTypeaheadInstance<T>({
  config,
  allConfigs,
}: {
  config: TypeaheadDescriptor<T>;
  allConfigs: TypeaheadDescriptor<T>[];
}) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const { results, isLoading, hasError } = useTypeaheadSearch(
    config,
    queryString,
  );

  // Build trigger regex for this config
  const triggerRegex = useMemo(
    () => buildTriggerRegex(config.trigger),
    [config.trigger],
  );

  // Get other triggers for conflict checking
  const otherTriggers = useMemo(
    () =>
      allConfigs
        .filter((c) => c.type !== config.type)
        .map((c) => ({
          trigger: c.trigger,
          regex: buildTriggerRegex(c.trigger),
        })),
    [allConfigs, config.type],
  );

  const checkForMatch = useCallback(
    (text: string): MenuTextMatch | null => {
      // Check if any other trigger matches first
      for (const other of otherTriggers) {
        const otherMatch = checkForTriggerMatch(text, other.regex, 0);
        if (otherMatch !== null) {
          return null; // Let other plugin handle it
        }
      }
      // Now check our own trigger
      return checkForTriggerMatch(text, triggerRegex, 1);
    },
    [triggerRegex, otherTriggers],
  );

  const options = useMemo(
    () =>
      results.slice(0, config.maxResults ?? 5).map((item) => {
        const key: unknown =
          config.convertToId == null ? item : config.convertToId(item);

        if (typeof key !== "string") {
          throw new Error(
            `typeaheadPlugin: convertToId must return a string key for non-primitive items.`,
          );
        }

        return new TypeaheadOption(key, item, config.renderMenuItem(item));
      }),
    [results, config],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: TypeaheadOption<T>,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const content =
          config.convertToId == null
            ? selectedOption.value
            : config.convertToId(selectedOption.value);

        if (typeof content !== "string") {
          throw new Error(
            `typeaheadPlugin: convertToId must return a string key for non-primitive items.`,
          );
        }

        const node = $createTypeaheadNode(
          config.type,
          content,
          config.trigger,
          undefined,
          config.nodeClassName,
        );
        if (nodeToReplace) {
          nodeToReplace.replace(node);
        }
        node.select();
        closeMenu();
      });
    },
    [editor, config.type, config.trigger, config.nodeClassName],
  );

  const parentRef = useCellValue(editorWrapperElementRef$);

  return (
    <LexicalTypeaheadMenuPlugin<TypeaheadOption<T>>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMatch}
      options={options}
      parent={parentRef?.current ?? undefined}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (!anchorElementRef.current || queryString === null) {
          return null;
        }

        let menuItems: JSX.Element[];
        let menuState: "loading" | "empty" | "error" | "results";

        if (hasError) {
          menuState = "error";
          menuItems = [
            <li
              key="error"
              className="item error-item"
              data-error="true"
              data-typeahead-item="true"
              aria-disabled={true}
              role="option"
              aria-selected={false}
            >
              Error loading results
            </li>,
          ];
        } else if (isLoading) {
          menuState = "loading";
          // Use custom loading indicator if provided, otherwise default text
          const loadingContent = config.loadingIndicator || "Loading...";
          menuItems = [
            <li
              key="loading"
              className="item loading-item"
              data-loading="true"
              data-typeahead-item="true"
              aria-disabled={true}
              role="option"
              aria-selected={false}
            >
              {loadingContent}
            </li>,
          ];
        } else if (results.length === 0) {
          menuState = "empty";
          menuItems = [
            <li
              key="empty"
              className="item empty-item"
              data-empty="true"
              data-typeahead-item="true"
              aria-disabled={true}
              role="option"
              aria-selected={false}
            >
              No results found
            </li>,
          ];
        } else {
          menuState = "results";
          menuItems = options.map((option, i: number) => (
            <TypeaheadMenuItem
              key={option.key}
              index={i}
              isSelected={selectedIndex === i}
              onClick={() => {
                setHighlightedIndex(i);
                selectOptionAndCleanUp(option);
              }}
              onMouseEnter={() => {
                setHighlightedIndex(i);
              }}
              option={option}
              config={config}
            />
          ));
        }

        // Use custom menu renderer if provided
        let menuContent: JSX.Element;
        if (config.renderMenu) {
          menuContent = config.renderMenu({
            children: menuItems,
            className: config.menuClassName,
          });
        } else {
          // Default menu rendering with custom class names
          const menuClasses = ["typeahead-popover"];
          if (config.menuClassName) {
            menuClasses.push(config.menuClassName);
          }

          menuContent = (
            <div
              className={menuClasses.join(" ")}
              data-typeahead-menu="true"
              data-state={menuState}
              aria-live="polite"
            >
              <ul>{menuItems}</ul>
            </div>
          );
        }

        return ReactDOM.createPortal(menuContent, anchorElementRef.current);
      }}
    />
  );
}

export function TypeaheadPlugin({
  configs,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configs: TypeaheadDescriptor<any>[];
}): JSX.Element {
  return (
    <>
      {configs.map((config) => (
        <SingleTypeaheadInstance
          key={config.type}
          config={config}
          allConfigs={configs}
        />
      ))}
    </>
  );
}
