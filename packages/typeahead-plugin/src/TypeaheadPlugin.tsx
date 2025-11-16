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
import type { TypeaheadConfig } from "./types";

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

class TypeaheadOption extends MenuOption {
  value: string;
  displayElement: JSX.Element;

  constructor(value: string, displayElement: JSX.Element) {
    super(value);
    this.value = value;
    this.displayElement = displayElement;
  }
}

function TypeaheadMenuItem({
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
  option: TypeaheadOption;
  config: TypeaheadConfig;
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

function useTypeaheadSearch(
  config: TypeaheadConfig,
  queryString: string | null,
): string[] {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (queryString == null) {
      setResults([]);
      return;
    }
    void config.searchCallback(queryString).then(setResults);
  }, [queryString, config]);

  return results;
}

function SingleTypeaheadInstance({
  config,
  allConfigs,
}: {
  config: TypeaheadConfig;
  allConfigs: TypeaheadConfig[];
}) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const results = useTypeaheadSearch(config, queryString);

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

  // CRITICAL: Check conflicts with other triggers
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
      results
        .slice(0, config.maxResults ?? 5)
        .map((item) => new TypeaheadOption(item, config.renderMenuItem(item))),
    [results, config],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: TypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const node = $createTypeaheadNode(
          config.type,
          selectedOption.value,
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

  return (
    <LexicalTypeaheadMenuPlugin<TypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (!anchorElementRef.current || !results.length) {
          return null;
        }

        const menuItems = options.map((option, i: number) => (
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
              data-state="open"
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
  configs: TypeaheadConfig[];
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
