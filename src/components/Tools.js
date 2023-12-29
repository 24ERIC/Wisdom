// import React from 'react';
// import '@blocknote/core/style.css';
// import { BlockNoteView, useBlockNote } from '@blocknote/react';

// function Tools() {
//   const editor = useBlockNote();

//   return (
//     <div>
//       <BlockNoteView editor={editor} theme={"dark"} />

//       <button onClick={() => {
//           editor.insertBlocks(
//             [{ content: "This block was inserted!" }],
//             editor.getTextCursorPosition().block,
//             "after"
//           );
//         }}>
//         Insert
//       </button>

//       <button onClick={() => {
//           editor.updateBlock(editor.getTextCursorPosition().block, {
//             content: "This block was updated!",
//           });
//         }}>
//         Update
//       </button>

//       <button onClick={() => {
//           editor.removeBlocks([editor.getTextCursorPosition().block]);
//         }}>
//         Remove
//       </button>

//       <button onClick={() => {
//           editor.replaceBlocks(
//             [editor.getTextCursorPosition().block],
//             [{ content: "This block was replaced!" }]
//           );
//         }}>
//         Replace
//       </button>
//     </div>
//   );
// }

// export default Tools;

import React from 'react';

export default function Tools() {
  return (<></>);
}
