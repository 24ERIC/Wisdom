import React, { useState, useEffect } from 'react';
import { Treebeard } from 'react-treebeard';

function KnowledgeTree() {
    const [data, setData] = useState([]);
    const [cursor, setCursor] = useState(null);

    useEffect(() => {
        fetch('/api/blog/tags')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setData(formatDataForTreebeard(data));
            })
            .catch(error => console.error('Error fetching tags:', error));
    }, []);
    

    const formatDataForTreebeard = (tags) => {
        return tags.map(tag => ({
            name: tag.name,
            id: tag.id,
            toggled: true,
            children: tag.children && tag.children.length > 0 ? formatDataForTreebeard(tag.children) : []
        }));
    };

    const onToggle = (node, toggled) => {
        if (cursor) {
            cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        setCursor(node);
    };

    return (
        <div>
            <Treebeard data={data} onToggle={onToggle} />
        </div>
    );
}

export default KnowledgeTree;
