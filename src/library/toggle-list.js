import React, { useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, convertFromRaw, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [toggleStatus, setToggleStatus] = useState({});

  useEffect(() => {
    const backendData = {
      "blocks": [
        {
          "type": "unordered-list-item",
          "text": "Toggle List Item 1",
          "depth": 0,
          "toggle": true,
          "key": "toggle-1"
        },
        {
          "type": "unordered-list-item",
          "text": "Detail 1.1",
          "depth": 1,
          "parent": "toggle-1"
        },
        {
          "type": "unordered-list-item",
          "text": "Detail 1.2",
          "depth": 1,
          "parent": "toggle-1"
        },
        {
          "type": "unordered-list-item",
          "text": "Toggle List Item 2",
          "depth": 0,
          "toggle": true,
          "key": "toggle-2"
        },
        {
          "type": "unordered-list-item",
          "text": "Detail 2.1",
          "depth": 1,
          "parent": "toggle-2"
        }
        // ... other blocks
      ]
    };

    initializeEditor(backendData);
  }, []);

  const initializeEditor = (backendData) => {
    const blocks = backendData.blocks.map(block => {
      return {
        text: block.toggle ? `🔽 ${block.text}` : block.text,
        type: block.type,
        depth: block.depth,
        key: block.key || Math.random().toString(36).substr(2, 5),
        entityRanges: [],
        inlineStyleRanges: [],
        data: { parent: block.parent, toggle: block.toggle }
      };
    });

    const contentState = convertFromRaw({
      entityMap: {},
      blocks: blocks
    });

    setEditorState(EditorState.createWithContent(contentState));
  };

  const handleToggleClick = (blockKey) => {
    setToggleStatus(prevStatus => {
      const newStatus = { ...prevStatus };
      newStatus[blockKey] = !newStatus[blockKey];
      return newStatus;
    });
  };

  const blockRendererFn = (contentBlock) => {
    const blockData = contentBlock.getData().toObject();
    if (blockData.toggle) {
      return {
        component: ToggleComponent,
        props: {
          onClick: () => handleToggleClick(contentBlock.getKey()),
          isOpen: toggleStatus[contentBlock.getKey()],
        },
      };
    }
  };

  return (
    <Editor 
      editorState={editorState} 
      onChange={setEditorState} 
      readOnly={true}
      blockRendererFn={blockRendererFn} 
    />
  );
};

const ToggleComponent = (props) => {
  const { block, contentState, blockProps: { onClick, isOpen } } = props;
  let text = block.getText();

  if (isOpen) {
    text = text.replace('🔽', '🔼');
  }

  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {text}
    </div>
  );
};

export default MyEditor;
