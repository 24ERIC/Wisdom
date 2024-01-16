
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function MyEditor() {
  const [todos, setTodos] = useState([
    { id: 'todo-1', text: 'Learn React' },
    { id: 'todo-2', text: 'Learn react-beautiful-dnd' },
    { id: 'todo-3', text: 'Learn React' },
    { id: 'todo-4', text: 'Learn react-beautiful-dnd' },
    { id: 'todo-5', text: 'Learn React' },
    { id: 'todo-6', text: 'Learn react-beautiful-dnd' },
    { id: 'todo-7', text: 'Learn React' },
    { id: 'todo-8', text: 'Learn react-beautiful-dnd' },
    { id: 'todo-9', text: 'Build a Todo App' }
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
    <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <React.Fragment key={todo.id}>
                {/* Render a placeholder blue line for the potential drop position */}
                {dragOverIndex === index && (
                  <div style={{ height: '2px', backgroundColor: 'blue' }}></div>
                )}
                <Draggable draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging ? provided.draggableProps.style.transform : null
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