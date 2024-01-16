
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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    {/* Six-dot icon for dragging */}
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default MyEditor;