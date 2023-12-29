import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const SERVER_URL = 'http://localhost:5000';

function Editor() {
  const quillRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: true,
      },
    });

    socketRef.current = io(SERVER_URL);

    // Handle incoming changes
    socketRef.current.on('receive-changes', delta => {
      quill.updateContents(delta);
    });

    // Send changes
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socketRef.current.emit('send-changes', delta);
    });
  }, []);

  return <div ref={quillRef}></div>;
}

export default Editor;
