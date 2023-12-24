import React from 'react';
import DragDropFileUpload from './Search/DragDropFileUpload';

function Plan() {
  const handleFileUpload = (file) => {
    console.log(file);
  };

  return (
    <div style={{ padding: 50 }}>
      <DragDropFileUpload onFileUpload={handleFileUpload} />
    </div>
  );
}

export default Plan;