<DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
  <Droppable droppableId="block-list">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {renderBlocks(pageData.blocks).map((blockElement, index) => (
          <Draggable key={blockElement.key} draggableId={blockElement.key} index={index}>
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
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <span
                  {...provided.dragHandleProps}
                  style={{ cursor: 'grab', marginRight: '8px' }}
                >
                  ⠿
                </span>
                {blockElement}
              </div>

            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>