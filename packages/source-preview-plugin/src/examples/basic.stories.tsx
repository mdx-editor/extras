import type { Story } from "@ladle/react";
import { MDXEditorMethods, MDXEditor, toolbarPlugin, DiffSourceToggleWrapper, listsPlugin, headingsPlugin } from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css'
import { useRef } from "react";
import { sourceWithPreviewPlugin } from "..";
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';


/**
 * Basic example story for the Source Preview Plugin
 */
export const Welcome: Story = () => {
  const ref = useRef<MDXEditorMethods>(null)
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  return (
    <div className="App">
      <MDXEditor
        ref={ref}
        onChange={(md) => {
          console.log('change', md)
        }}
        markdown="Hello world"
        plugins={[
          listsPlugin(),
          headingsPlugin(),
          sourceWithPreviewPlugin({
            viewMode: 'source',
            editor: ({defaultValue, onChange, error}) => (
              <div style={{paddingTop: '2rem'}}>
                <Editor
                  height="600px"
                  width="100%"
                  defaultLanguage="markdown"
                  defaultValue={defaultValue}
                  onChange={(value) => {
                    onChange(value ?? '')
                  }}
                  onMount={(editor) => {
                    monacoRef.current = editor;
                  }}
                  options={{
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    fontSize: 14,
                    fontFamily: 'monospace',
                    tabSize: 2,
                    insertSpaces: true
                  }}
                />

                {error && (
                  <div style={{ marginTop: '1rem', color: 'red' }}>
                    <p>{error.error}.</p>
                  </div>
                )}

              </div>
            )
          }),
          toolbarPlugin({
            toolbarContents: () => <DiffSourceToggleWrapper options={['source', 'rich-text']} SourceToolbar={
              <div>
                <button onClick={() => {
                  const editor = monacoRef.current;
                  if (!editor) return;

                  const selection = editor.getSelection();
                  if (!selection) return;

                  const selectedText = editor.getModel()?.getValueInRange(selection);
                  if (!selectedText) return;

                  const boldText = `**${selectedText}**`;
                  editor.executeEdits('bold-button', [{
                    range: selection,
                    text: boldText
                  }]);

                  // Move cursor after the bold text
                  const newPosition = {
                    lineNumber: selection.endLineNumber,
                    column: selection.endColumn + 4
                  };
                  editor.setPosition(newPosition);
                  editor.focus();
                }}>Bold!</button>
              </div>
            }>Hi!</DiffSourceToggleWrapper>
          })
        ]}
      />
    </div>
  )
};

Welcome.meta = {
  title: "Welcome",
};
