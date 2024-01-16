import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function MyEditor() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Learn React' },
    { id: '2', text: 'Learn react-beautiful-dnd' },
    { id: '3', text: 'Learn React' }
  ]);

  const [draggingIndex, setDraggingIndex] = useState(null);

  const onDragStart = (start) => {
    setDraggingIndex(start.source.index);
  };

  const onDragEnd = (result) => {
    setDraggingIndex(null);
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <React.Fragment key={todo.id}>
                {draggingIndex === index && (
                  <div style={{ opacity: 1 }}>
                    ⠿ {todo.text}
                  </div>
                )}
                <Draggable draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                      }}
                    >
                      <span
                        {...provided.dragHandleProps}
                        style={{ cursor: 'grab', marginRight: '8px' }}
                      >
                        ⠿
                      </span>
                      {todo.text}
                    </div>
                  )}
                </Draggable>
              </React.Fragment>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default MyEditor;
