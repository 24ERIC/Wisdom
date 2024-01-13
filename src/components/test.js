

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Page() {
    const [pageData, setPageData] = useState({ page_title: '', blocks: [] });
    const { id } = useParams();
    const focusedElementRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                if (response.data && response.data.page_title && Array.isArray(response.data.blocks)) {
                    setPageData(response.data);
                } else {
                    console.error('Invalid format of fetched data');
                }
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id]);

    useEffect(() => {
        if (pageData.newBlockId) {
            const newBlockElement = document.querySelector(`[data-block-id='${pageData.newBlockId}']`);
            if (newBlockElement) {
                newBlockElement.focus();
                setCaretPosition(newBlockElement, newBlockElement.innerText.length);
            }
        }
    });
    
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


    const handleTitleChange = (content, element) => {
        const caret = getCaretPosition(element);
        const updatedPageData = {
            ...pageData,
            page_title: content
        };
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



    const updateBlockByPath = (blocks, path, newContent) => {
        const ids = path.split('/').filter(Boolean);
        let currentBlocks = blocks;

        ids.forEach((id, index) => {
            const blockIndex = currentBlocks.findIndex(block => block.block_id === id);
            if (blockIndex === -1) return;

            if (index === ids.length - 1) {
                currentBlocks[blockIndex].block_content = newContent;
            } else {
                if (!currentBlocks[blockIndex].children) {
                    currentBlocks[blockIndex].children = [];
                }
                currentBlocks = currentBlocks[blockIndex].children;
            }
        });

        return blocks;
    };

    const handleContentChange = (content, blockPath, element) => {
        const caret = getCaretPosition(element);
        let updatedBlocks = updateBlockByPath([...pageData.blocks], blockPath, content);

        setPageData(prevPageData => ({
            ...prevPageData,
            blocks: updatedBlocks,
        }));

        setTimeout(() => setCaretPosition(element, caret), 0);

        const blockId = blockPath.split('/').pop();
        axios.put(`http://localhost:5000/blocks/${blockId}`, {
            content: content,
        })
            .then(response => {
                console.log('Saved:', response.data);
            })
            .catch(error => {
                console.error('Error saving block:', error);
            });
    };
    const handleInput = async (event, blockPath) => {
        // Define the variables at the top of the function
        const currentElement = event.target;
        const cursorPosition = getCaretPosition(currentElement);
    
        if (event.key === 'Enter') {
            event.preventDefault();
            const fullContent = currentElement.innerText;
            const currContent = fullContent.substring(0, cursorPosition);
            const newContent = fullContent.substring(cursorPosition);
            currentElement.innerText = currContent;
            const currentBlockId = blockPath.split('/').pop();
            try {
                const response1 = await axios.post(`http://localhost:5000/blocks/${currentBlockId}`, {
                    currContent: currContent,
                    newContent: newContent
                });
                const response = await axios.get(`http://localhost:5000/pages/${id}`);
                if (response.data && response.data.page_title && Array.isArray(response.data.blocks)) {
                    const newBlockId = response1.data.block_id;
                    setPageData({
                        ...response.data,
                        newBlockId: newBlockId,
                    });
                } else {
                    console.error('Invalid format of fetched data');
                }
            } catch (error) {
                console.error('Error processing new block creation:', error);
            }
        } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
            handleArrowNavigation(event.key, cursorPosition, currentElement, blockPath);
        } else {
            focusedElementRef.current = currentElement;
            handleContentChange(currentElement.innerText, blockPath, currentElement);
        }
    };
    

    const handleArrowNavigation = (key, cursorPosition, element, blockPath) => {
        if (key === 'ArrowLeft' || key === 'ArrowRight') {
            handleHorizontalNavigation(key, cursorPosition, element, blockPath);
        } else if (key === 'ArrowUp' || key === 'ArrowDown') {
            handleVerticalNavigation(key, blockPath);
        }
    };
    
    const handleHorizontalNavigation = (key, cursorPosition, element, blockPath) => {
        const atStart = key === 'ArrowLeft' && cursorPosition === 0;
        const atEnd = key === 'ArrowRight' && cursorPosition === element.innerText.length;
    
        if (atStart || atEnd) {
            // Move to the adjacent block
            const adjacentBlockElement = findAdjacentBlockElement(blockPath, atEnd);
            if (adjacentBlockElement) {
                adjacentBlockElement.focus();
                const newPosition = atEnd ? 0 : adjacentBlockElement.innerText.length;
                setCaretPosition(adjacentBlockElement, newPosition);
            }
        }
    };
    
    const handleVerticalNavigation = (key, blockPath) => {
        // Move to the previous or next block
        const isNext = key === 'ArrowDown';
        const adjacentBlockElement = findAdjacentBlockElement(blockPath, isNext);
        if (adjacentBlockElement) {
            adjacentBlockElement.focus();
            const newPosition = isNext ? 0 : adjacentBlockElement.innerText.length;
            setCaretPosition(adjacentBlockElement, newPosition);
        }
    };
    
    const findAdjacentBlockElement = (blockPath, isNext) => {
        // Extract the current block's ID from the path
        const currentBlockId = blockPath.split('/').pop();
    
        // Find the index of the current block in the page data
        const currentBlockIndex = pageData.blocks.findIndex(block => block.block_id === currentBlockId);
    
        if (currentBlockIndex === -1) return null; // Current block not found
    
        // Calculate the index of the adjacent block
        const adjacentBlockIndex = isNext ? currentBlockIndex + 1 : currentBlockIndex - 1;
    
        // Check if the adjacent block index is within the bounds of the blocks array
        if (adjacentBlockIndex < 0 || adjacentBlockIndex >= pageData.blocks.length) {
            return null; // Adjacent block does not exist
        }
    
        // Get the block ID of the adjacent block
        const adjacentBlockId = pageData.blocks[adjacentBlockIndex].block_id;
    
        // Return the HTML element of the adjacent block
        return document.querySelector(`[data-block-id='${adjacentBlockId}']`);
    };
    



    const renderBlocks = (blocks, path = '') => {
        if (!Array.isArray(blocks)) {
            return null;
        }

        return blocks.map((block, index) => {
            const blockPath = `${path}/${block.block_id}`;
            const blockStyle = { marginLeft: `${block.indentLevel * 20}px` };
            const key = `block-${blockPath}`;

            const handleKeyDown = (e) => handleInput(e, blockPath);
            const handleBlockInput = (e) => handleContentChange(e.target.innerText, blockPath, e.target);


            const blockProps = {
                onInput: handleBlockInput,
                onKeyDown: handleKeyDown,
                contentEditable: true,
                suppressContentEditableWarning: true,
                className: `block block-${block.block_type}`,
                style: blockStyle,
                'data-block-id': block.block_id
            };

            const renderChildren = (children) => {
                return children && children.length > 0 ? renderBlocks(children, blockPath) : null;
            };

            switch (block.block_type) {
                case 'header1':
                    return <h1 key={key} {...blockProps}>{block.block_content}</h1>;
                case 'header2':
                    return <h2 key={key} {...blockProps}>{block.block_content}</h2>;
                case 'header3':
                    return <h3 key={key} {...blockProps}>{block.block_content}</h3>;
                case 'bullet-point':
                    return (
                        <ul key={key} style={blockStyle}>
                            <li>
                                <div {...blockProps}>
                                    {block.block_content}
                                </div>
                                {renderChildren(block.children)}
                            </li>
                        </ul>
                    );
                case 'text':
                default:
                    return <p key={key} {...blockProps}>{block.block_content}</p>;
            }
        });
    };

    return (
        <div className="page-content">
            {pageData && pageData.blocks && pageData.blocks.length > 0 ? (
                <>
                    <div
                        contentEditable
                        onInput={(e) => handleTitleChange(e.target.innerText, e.target)}
                        suppressContentEditableWarning={true}
                        ref={focusedElementRef}
                    >
                        {pageData.page_title}
                    </div>
                    <div className="blocks-container">
                        {renderBlocks(pageData.blocks)}
                    </div>
                </>
            ) : (
                <p>Loading page or no data available...</p>
            )}
        </div>
    );
}

export default Page;
