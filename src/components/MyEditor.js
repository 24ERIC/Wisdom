import React, { useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    // Simulate fetching data from backend
    const backendData = {
      blocks: [
        { type: 'unordered-list-item', text: 'Main Bullet Point', depth: 0 },
        { type: 'unordered-list-item', text: 'Subitem 1', depth: 1 },
        { type: 'unordered-list-item', text: 'Sub-Subitem 1', depth: 2 },
        { type: 'unordered-list-item', text: 'Sub-Subitem 2', depth: 2 },
        { type: 'unordered-list-item', text: 'Sub-Subitem 3', depth: 2 },
        { type: 'unordered-list-item', text: 'Subitem 2', depth: 1 },
        { type: 'unordered-list-item', text: 'Subitem 3', depth: 1 },
      ],
    };

    const contentState = convertFromRaw({
      entityMap: {},
      blocks: backendData.blocks.map(block => ({
        text: block.text,
        type: block.type,
        depth: block.depth,
        key: Math.random().toString(36).substr(2, 5), // Generate a unique key for each block
        entityRanges: [],
        inlineStyleRanges: [],
      })),
    });

    setEditorState(EditorState.createWithContent(contentState));
  }, []);

  return (
    <Editor 
      editorState={editorState} 
      onChange={setEditorState} 
      readOnly={true} // Set to false if you want it to be editable
    />
  );
};

export default MyEditor;
