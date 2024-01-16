import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function MyEditor() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Learn React' },
    { id: '2', text: 'Learn react-beautiful-dnd' },
    { id: '3', text: 'Learn React' }
  ]);

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const onDragStart = (start) => {
    setDraggingIndex(start.source.index);
  };

  const onDragUpdate = (update) => {
    const destination = update.destination;
    setDragOverIndex(destination ? destination.index : null);
  };

  const onDragEnd = (result) => {
    setDraggingIndex(null);
    setDragOverIndex(null);
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate}  onDragEnd={onDragEnd}> 
      <Droppable droppableId="todos">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <div key={todo.id} style={{ position: 'relative' }}>
                
                {dragOverIndex === index && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    backgroundColor: 'skyblue',
                    zIndex: 1
                  }}></div>
                ) }
                { draggingIndex === index && (
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
                        transform: snapshot.isDragging ? provided.draggableProps.style.transform : null,
                        marginBottom: '2px',
                        marginTop: '2px',
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
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default MyEditor;