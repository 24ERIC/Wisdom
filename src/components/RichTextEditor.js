import React, { useState, useCallback } from 'react';
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';
import './App.css';

const initialBlock = { id: Date.now(), html: '', type: 'p' };

const EditableBlock = ({ block, onUpdate, onKeyPress, showMenu, menuPosition, onSelectMenuItem }) => {  const [html, setHtml] = useState(block.html);

  const handleChange = useCallback(evt => {
    const sanitizeConf = {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2'],
      allowedAttributes: { a: ['href'] },
    };

    const sanitized = sanitizeHtml(evt.target.value, sanitizeConf);
    setHtml(sanitized);
    onUpdate(block.id, sanitized);
  }, [onUpdate, block.id]);

  return (
    <>
      {showMenu && (
        <div style={{ position: 'absolute', top: menuPosition.y, left: menuPosition.x }}>
          <button onClick={() => onSelectMenuItem('p')}>Paragraph</button>
          <button onClick={() => onSelectMenuItem('h1')}>Heading 1</button>
          <button onClick={() => onSelectMenuItem('h2')}>Heading 2</button>
          {/* Add more options as needed */}
        </div>
      )}
      <ContentEditable
        tagName={block.type}
        html={html}
        onChange={handleChange}
        onBlur={handleChange}
        onKeyUp={onKeyPress}
        className={`editable-block ${block.type}`}
      />
    </>
  );
};




const RichTextEditor = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [blocks, setBlocks] = useState([initialBlock]);

  const handleUpdateBlock = useCallback((id, newHtml) => {
    setBlocks(currentBlocks =>
      currentBlocks.map(block => (block.id === id ? { ...block, html: newHtml } : block))
    );
  }, []);

  const handleKeyPress = useCallback((evt, blockId) => {
    console.log("into function handleKeyPress")
    if (evt.key === '/' ) {
      console.log("into function handleKeyPress, inside if")
      evt.preventDefault();
      const { x, y } = getCaretCoordinates(evt.target, evt.target.selectionStart);
      setMenuPosition({ x, y });
      setShowMenu(true);
      setActiveBlockId(blockId);
    }
  }, []);

  const handleSelectMenuItem = useCallback((type) => {
    setShowMenu(false);
    setBlocks(currentBlocks =>
      currentBlocks.map(block => (block.id === activeBlockId ? { ...block, type } : block))
    );
  }, [activeBlockId]);

  return (
    <div className="editor">
      {blocks.map(block => (
        <EditableBlock
          key={block.id}
          block={block}
          onUpdate={handleUpdateBlock}
          onKeyPress={(evt) => handleKeyPress(evt, block.id)}
          showMenu={showMenu && block.id === activeBlockId}
          menuPosition={menuPosition}
          onSelectMenuItem={handleSelectMenuItem}
        />
      ))}
    </div>
  );
};

function getCaretCoordinates(element, position) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element.childNodes[0], position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  const rect = range.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

export default RichTextEditor;


