import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [pageData, setPageData] = useState({ page_title: '', blocks: [] });

    const updateBlockContent = (blockId, newContent) => {
        setPageData(prevPageData => ({
            ...prevPageData,
            blocks: prevPageData.blocks.map(block =>
                block.id === blockId ? { ...block, content: newContent } : block
            )
        }));
    };

    return (
        <AppContext.Provider value={{ pageData, setPageData, updateBlockContent }}>
            {children}
        </AppContext.Provider>
    );
};
