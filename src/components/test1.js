
return (
  <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
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
                  height: '2px',
                  backgroundColor: 'blue',
                  zIndex: 1
                }}></div>
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
                      marginBottom: '8px', // Add some space between items
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