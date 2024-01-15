// TextBlock.js
import React from 'react';
import { useAppContext } from './AppContext';

const TextBlock = ({ block }) => {
    const { updateBlock } = useAppContext();

    const handleContentChange = (e) => {
        // Assuming block content is plain text
        updateBlock(block.block_id, e.target.innerText, block.style);
    };
    const handleStyleChange = (color) => {
        // Update the block's color
        updateBlock(block.block_id, block.content, { ...block.style, color });
    };

    return (
        <div>
            <div
                contentEditable
                onInput={handleContentChange}
                suppressContentEditableWarning={true}
                style={{ color: block.style?.color }}
            >
                {block.content}
            </div>
            <button onClick={() => handleStyleChange('red')}>Red</button>
            <button onClick={() => handleStyleChange('green')}>Green</button>
            <button onClick={() => handleStyleChange('blue')}>Blue</button>
        </div>
    );
};

export default TextBlock;        