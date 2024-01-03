import React, { useState } from "react";
import "./styles.css";
import EditableBlock from "./editableBlock";
import uid from "./uid";


const initialBlock = { id: uid(), html: "", tag: "p" };

const EditablePage = () => {
  const [blocks, setBlocks] = useState([initialBlock]);

  const updatePageHandler = (updatedBlock) => {
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html
    };
    setBlocks(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    const newBlock = { id: uid(), html: "", tag: "p" };
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlocks(updatedBlocks);
    // Focus logic would need to be implemented with refs and useEffect
  };

  const deleteBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    if (index > 0) {
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      // Focus logic would need to be implemented with refs and useEffect
    }
  };

  return (
    <div className="Page">
      {blocks.map((block, key) => (
        <EditableBlock
          key={key}
          id={block.id}
          tag={block.tag}
          html={block.html}
          updatePage={updatePageHandler}
          addBlock={addBlockHandler}
          deleteBlock={deleteBlockHandler}
        />
      ))}
    </div>
  );
};

export default EditablePage;
