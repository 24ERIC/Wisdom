// AppContext.js
import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [pageData, setPageData] = useState({ page_title: '', blocks: [] });

    // Function to update a specific block's content and style
    const updateBlock = (blockId, newContent, newStyle) => {
        setPageData(prevData => {
            return {
                ...prevData,
                blocks: prevData.blocks.map(block =>
                    block.block_id === blockId ? { ...block, content: newContent, style: newStyle } : block
                )
            };
        });
    };

    return (
        <AppContext.Provider value={{ pageData, setPageData, updateBlock }}>
            {children}
        </AppContext.Provider>
    );
};
