import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Page() {
    const [pageData, setPageData] = useState(null);
    const { id } = useParams();
    const focusedElementRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                setPageData(response.data);
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id]);
    const handleTitleChange = (content, element) => {
        const caret = getCaretPosition(element);
        const updatedPageData = [...pageData];
        updatedPageData[0].page_title = content;
        setPageData(updatedPageData);
        setTimeout(() => setCaretPosition(element, caret), 0);
        axios.put(`http://localhost:5000/pages/${id}`, {
            title: content,
        })
        .then(response => {
            console.log('Title Saved:', response.data);
        })
        .catch(error => {
            console.error('Error saving title:', error);
        });
    };

    const getCaretPosition = (element) => {
        let caretOffset = 0;
        const doc = element.ownerDocument || element.document;
        const win = doc.defaultView || doc.parentWindow;
        let sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                const range = win.getSelection().getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        }
        return caretOffset;
    };

    const setCaretPosition = (element, offset) => {
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(element.childNodes[0], offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        element.focus();
    };

    const handleContentChange = (content, index, element) => {
        const caret = getCaretPosition(element);
        const updatedPageData = [...pageData];
        updatedPageData[index].block_content = content;
        setPageData(updatedPageData);
        setTimeout(() => setCaretPosition(element, caret), 0);
        axios.put(`http://localhost:5000/blocks/${updatedPageData[index].block_id}`, {
            content: content,
        })
        .then(response => {
            console.log('Saved:', response.data);
        })
        .catch(error => {
            console.error('Error saving block:', error);
        });
    };
    
    const renderBlock = (block, index) => {
        const handleInput = (event) => {
            focusedElementRef.current = event.target;
            handleContentChange(event.target.innerText, index + 1, event.target);
        };
        const blockProps = {
            onInput: handleInput,
            contentEditable: true,
            suppressContentEditableWarning: true,
            className: `block block-${block.block_type}`,
            ref: index === 0 ? focusedElementRef : null,
        };
        switch (block.block_type) {
            case 'header1':
                return <h1 {...blockProps}>{block.block_content}</h1>;
            case 'header2':
                return <h2 {...blockProps}>{block.block_content}</h2>;
            case 'header3':
                return <h3 {...blockProps}>{block.block_content}</h3>;
            case 'text':
            default:
                return <p {...blockProps}>{block.block_content}</p>;
        }
    };
    
    return (
        <div className="page-content">
    {pageData ? (
        <>
            <div
                contentEditable
                onInput={(e) => handleTitleChange(e.target.innerText, e.target)}
                onBlur={(e) => {/* handle saving the title */}}
                suppressContentEditableWarning={true}
                ref={focusedElementRef}
            >
                {pageData[0].page_title}
            </div>
            <div className="blocks-container">
                {pageData.slice(1).map((block, index) => (
                    <div key={block.block_id} className="block">
                        {renderBlock(block, index)}
                    </div>
                ))}
            </div>
        </>
    ) : (
        <p>Loading page...</p>
    )}
</div>
    );
}

export default Page;
