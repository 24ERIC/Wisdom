import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Page() {
    const [pageData, setPageData] = useState({ page_title: '', blocks: [] });
    const [allBlockIds, setAllBlockIds] = useState([]);
    const { id } = useParams();
    const focusedElementRef = useRef(null);
    const [newBlockId, setNewBlockId] = useState(null);
    const PLACEHOLDER_TEXT = "Press 'space' for AI, \"/\" for commands...";


    const extractBlockIds = (blocks) => {
        return blocks.reduce((acc, block) => {
            acc.push(block.block_id);
            if (block.children && block.children.length > 0) {
                acc.push(...extractBlockIds(block.children));
            }
            return acc;
        }, []);
    };

    useEffect(() => {
        console.log("get pageData",pageData);

        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                console.log("http://localhost:5000/pages/1 response",response);

                if (response.data && response.data.page_title && Array.isArray(response.data.blocks)) {
                    setPageData(response.data);
                    setAllBlockIds(extractBlockIds(response.data.blocks));
                } else {
                    console.error('Invalid format of fetched data');
                }
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id]);


    useEffect(() => {
        if (newBlockId) {
            const newBlockElement = document.querySelector(`[data-block-id='${newBlockId}']`);
            if (newBlockElement) {
                newBlockElement.focus();
                setCaretPosition(newBlockElement, 0);
            }
            setNewBlockId(null);
        }
    }, [newBlockId]);


    const handlePlaceholder = (element) => {
        if (!element.innerText.trim() && !document.activeElement.isSameNode(element)) {
            element.innerText = PLACEHOLDER_TEXT;
            element.classList.add("placeholder-style");
        } else if (element.innerText === PLACEHOLDER_TEXT && !document.activeElement.isSameNode(element)) {
            element.innerText = '';
            element.classList.remove("placeholder-style");
        }
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
        if (element.childNodes.length === 0) {
            element.appendChild(document.createTextNode(PLACEHOLDER_TEXT));
            element.classList.add("placeholder-style");
        }

        const textNode = element.childNodes[0];
        const adjustedOffset = Math.min(offset, textNode.length);


        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(element.childNodes[0], adjustedOffset);
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
        axios.put(`http://localhost:5000/pages/${id}`, { title: content })
            .then(response => {
                console.log('Title Saved:', response.data);
            })
            .catch(error => {
                console.error('Error saving title:', error);
            });
    };

    const updateBlockById = (blocks, blockIdWithChildren, newContent) => {
        const [blockId, childIds] = blockIdWithChildren;
        const blockIndex = blocks.findIndex(block => block.block_id === blockId);
        if (blockIndex === -1) return blocks;
        blocks[blockIndex].block_content = newContent;
        if (childIds && Array.isArray(childIds) && childIds.length > 0) {
            blocks[blockIndex].children = updateBlockById(blocks[blockIndex].children || [], childIds, newContent);
        }
        return blocks;
    };

    const handleContentChange = (content, blockIdWithChildren, element) => {
        const caret = getCaretPosition(element);
        let updatedBlocks = updateBlockById([...pageData.blocks], blockIdWithChildren, content);
        setPageData(prevPageData => {
            const newPageData = { ...prevPageData, blocks: updatedBlocks };
            setAllBlockIds(extractBlockIds(newPageData.blocks));
            return newPageData;
        });
        setTimeout(() => setCaretPosition(element, caret), 0);
        handlePlaceholder(element);
        const blockId = blockIdWithChildren[0];
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

    const handleInput = async (event, blockIdWithChildren) => {
        console.log("Key pressed:", event.key);
        const currentElement = event.target;
        if (currentElement.innerText === PLACEHOLDER_TEXT && event.key !== 'Enter') {
            currentElement.innerText = '';
            currentElement.classList.remove("placeholder-style");
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            const cursorPosition = getCaretPosition(currentElement);
            const fullContent = currentElement.innerText;
            const currContent = fullContent.substring(0, cursorPosition);
            const newContent = fullContent.substring(cursorPosition).trim();
            currentElement.innerText = currContent;
            const currentBlockId = blockIdWithChildren[0];
            const newBlockData = {
                currContent: currContent,
                newContent: newContent
            };
            try {
                const response1 = await axios.post(`http://localhost:5000/blocks/${currentBlockId}`, newBlockData);
                const newBlockId = response1.data.block_id;
                const response = await axios.get(`http://localhost:5000/pages/${id}`);
                if (response.data && response.data.page_title && Array.isArray(response.data.blocks)) {
                    setPageData({
                        ...response.data,
                        newBlockId: newBlockId,
                    });
                    setPageData(response.data);
                    setNewBlockId(newBlockId);
                    setTimeout(() => {
                        const newBlockElement = document.querySelector(`[data-block-id='${newBlockId}']`);
                        if (newBlockElement) {
                            newBlockElement.focus();
                            setCaretPosition(newBlockElement, 0);
                        }
                    }, 0);
                } else {
                    console.error('Invalid format of fetched data');
                }
            } catch (error) {
                console.error('Error processing new block creation:', error);
            }
        } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
            handleArrowNavigation(event, blockIdWithChildren[0]);
        } else if (event.key === 'Backspace') {
            console.log("Delete key pressed on block:", blockIdWithChildren[0]);
            if (!currentElement.innerText.trim()) {
                console.log("Block is empty, proceeding with delete");
                event.preventDefault();
                const currentBlockId = blockIdWithChildren[0];
                await handleDeleteBlock(currentBlockId);
                return;
            }
        }  else {
            focusedElementRef.current = event.target;
            handleContentChange(event.target.innerText, blockIdWithChildren, event.target);
        }
    };

    const handleDeleteBlock = async (blockId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/blocks/${blockId}/single`);
            console.log('Block deleted:', response);
    
            const responsePageData = await axios.get(`http://localhost:5000/pages/${id}`);
            if (responsePageData.data && responsePageData.data.page_title && Array.isArray(responsePageData.data.blocks)) {
                setPageData(responsePageData.data);
                setAllBlockIds(extractBlockIds(responsePageData.data.blocks));
            } else {
                console.error('Invalid format of fetched data');
            }
        } catch (error) {
            console.error('Error deleting block:', error);
        }
    };

    const handleArrowNavigation = (event, currentBlockId) => {
        const currentIndex = allBlockIds.indexOf(currentBlockId);
        if (currentIndex === -1) return;
        const currentElement = document.querySelector(`[data-block-id='${currentBlockId}']`);
        const caretPos = getCaretPosition(currentElement);
        const textLength = currentElement.innerText.length;
        let nextIndex;
        switch (event.key) {
            case 'ArrowUp':
                nextIndex = currentIndex - 1;
                break;
            case 'ArrowDown':
                nextIndex = currentIndex + 1;
                break;
            case 'ArrowLeft':
                if (caretPos === 0) {
                    event.preventDefault();
                    nextIndex = currentIndex - 1;
                    focusOnBlock(nextIndex, true);
                }
                return;
            case 'ArrowRight':
                if (caretPos === textLength) {
                    event.preventDefault();
                    nextIndex = currentIndex + 1;
                    focusOnBlock(nextIndex, false);
                }
                return;
            default:
                return;
        }

        focusOnBlock(nextIndex);
    };

    const focusOnBlock = (index, focusAtEnd = false) => {
        if (index >= 0 && index < allBlockIds.length) {
            const nextBlockId = allBlockIds[index];
            const nextBlockElement = document.querySelector(`[data-block-id='${nextBlockId}']`);
            if (nextBlockElement) {
                nextBlockElement.focus();
                const position = focusAtEnd ? nextBlockElement.innerText.length : 0;
                console.log("position", position);
                setCaretPosition(nextBlockElement, position);
            }
        }
    };

    const renderBlocks = (blocks, parentBlockIdList = []) => {
        if (!Array.isArray(blocks)) {
            return null;
        }
        return blocks.map((block, index) => {
            const blockIdWithChildren = [block.block_id, block.children ? block.children.map(child => child.block_id) : []];
            const newParentBlockIdList = [...parentBlockIdList, blockIdWithChildren];
            const blockStyle = { marginLeft: `${block.indentLevel * 20}px` };
            const key = `block-${block.block_id}-${index}`;
            const handleKeyDown = (e) => handleInput(e, blockIdWithChildren);
            const handleBlockInput = (e) => handleContentChange(e.target.innerText, blockIdWithChildren, e.target);
            const blockProps = {
                onFocus: (e) => handlePlaceholder(e.target),
                onBlur: (e) => handlePlaceholder(e.target),
                onInput: handleBlockInput,
                onKeyDown: handleKeyDown,
                contentEditable: true,
                suppressContentEditableWarning: true,
                className: `block block-${block.block_type}`,
                style: blockStyle,
                'data-block-id': block.block_id
            };
            const renderChildren = (children) => {
                return children && children.length > 0 ? renderBlocks(children, newParentBlockIdList) : null;
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