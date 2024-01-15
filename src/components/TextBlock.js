import React from 'react';
import { Editor, EditorState, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useAppContext } from './AppContext';

const TextBlock = ({ block }) => {
    const { updateBlockContent } = useAppContext();

    // Ensure that block.content is not undefined
    const content = block.content || '';

    const [editorState, setEditorState] = React.useState(
        EditorState.createWithContent(ContentState.createFromText(content))
    );

    const handleEditorChange = (newEditorState) => {
        setEditorState(newEditorState);
        const contentState = newEditorState.getCurrentContent();
        updateBlockContent(block.id, contentState.getPlainText());
    };

    return (
        <Editor editorState={editorState} onChange={handleEditorChange} />
    );
};

export default TextBlock;
