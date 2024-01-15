// Page.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAppContext } from './AppContext';
import TextBlock from './TextBlock';

function Page() {
    const { pageData, setPageData } = useAppContext();
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                if (response.data) {
                    setPageData(response.data);
                } else {
                    console.error('Invalid format of fetched data');
                }
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id, setPageData]);

    const renderBlocks = () => {
        return pageData.blocks.map(block => {
            return <TextBlock key={block.block_id} block={block} />;
        });
    };

    return (
        <div className="page-content">
            <h1>{pageData.page_title}</h1>
            <div className="blocks-container">
                {renderBlocks()}
            </div>
        </div>
    );
}

export default Page;