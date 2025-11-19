import type { JSX } from "react";

/**
 * Props passed to custom menu renderer
 */
export interface MenuRenderProps {
  /** The menu items to render */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props passed to custom menu item wrapper renderer
 */
export interface MenuItemWrapperProps {
  /** The menu item content to render */
  children: React.ReactNode;
  /** Whether this item is currently selected/highlighted */
  isSelected: boolean;
  /** Handler for click events */
  onClick: () => void;
  /** Handler for mouse enter events */
  onMouseEnter: () => void;
  /** Item index for accessibility */
  index: number;
}

/**
 * Configuration for a single typeahead type (e.g., mentions, hashtags)
 */
export interface TypeaheadDescriptor<T> {
  /**
   * Unique identifier for this typeahead type. It's used for the text directive name (e.g., :mention[...], :hashtag[...])
   *
   * MUST be unique across all configs in the plugin.
   *
   * Examples: 'mention', 'hashtag', 'emoji', 'issue'
   */
  type: string;

  /**
   * Trigger character(s) - e.g., '@', '#', ':'
   */
  trigger: string;

  /**
   * Async function to resolve search results
   * @param query - User's search string
   * @returns Promise resolving to array of matching items
   */
  searchCallback: (query: string) => Promise<T[]>;

  /**
   * Render function for menu items
   * @param item - The data item to render
   * @returns React element to display in menu
   */
  renderMenuItem: (item: T) => JSX.Element;

  /**
   * Converter function for items
   * @param item - The data item to render
   * @returns id sting value
   */
  convertToId?: (item: T) => string;

  renderEditor?: (item: T) => JSX.Element;

  /**
   * Optional: Max results to show
   * @default 5
   */
  maxResults?: number;

  /**
   * Optional: Custom CSS class for the typeahead node in the editor
   * Applied in addition to default classes (typeahead, typeahead-{type})
   */
  nodeClassName?: string;

  /**
   * Optional: Custom CSS class for the autocomplete menu container
   */
  menuClassName?: string;

  /**
   * Optional: Custom CSS class for menu items
   */
  menuItemClassName?: string;

  /**
   * Optional: Custom CSS class for the selected/highlighted menu item
   */
  menuItemSelectedClassName?: string;

  /**
   * Optional: Custom menu container renderer
   * When provided, overrides the default menu rendering
   * Use this to integrate with component libraries like shadcn
   */
  renderMenu?: (props: MenuRenderProps) => JSX.Element;

  /**
   * Optional: Custom menu item wrapper renderer
   * When provided, overrides the default menu item wrapper
   * Use this to integrate with component libraries like shadcn
   */
  renderMenuItemWrapper?: (props: MenuItemWrapperProps) => JSX.Element;
}

/**
 * Plugin parameters
 */
export interface TypeaheadPluginParams {
  /**
   * Array of typeahead configurations.
   * Each config.type must be unique.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configs: TypeaheadDescriptor<any>[];
}
