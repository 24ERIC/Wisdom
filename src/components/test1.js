import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MyEditor() {
  const [blocks, setBlocks] = useState([]);
  const { id } = useParams();
  const focusedElementRef = useRef(null);
  const [newBlockId, setNewBlockId] = useState(null);
  const PLACEHOLDER_TEXT = "Press 'space' for AI, \"/\" for commands...";

  // ... Rest of your component code ...

  useEffect(() => {
    axios.get(`http://localhost:5000/page/${id}`)
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setBlocks(response.data);
        } else {
          console.error('Invalid format of fetched data');
        }
      })
      .catch(error => {
        console.error('Error fetching page:', error);
      });
  }, [id]);

  // ... Rest of your component code ...

  return (
    <>
      {blocks.length > 0 ? (
        <div>
          {/* Render blocks here */}
        </div>
      ) : (
        <p>Loading page or no data available...</p>
      )}

      {/* Your DragDropContext and other components */}
    </>
  );
}

export default MyEditor;
