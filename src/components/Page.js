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
                setPageData(response.data);
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id, setPageData]);

    return (
        <div className="page-content">
            <h1>{pageData.page_title}</h1>
            <div className="blocks-container">
                {pageData.blocks.map(block => (
                    // Ensure each block has a unique key
                    <TextBlock key={block.id} block={block} />
                ))}
            </div>
        </div>
    );
}

export default Page;
