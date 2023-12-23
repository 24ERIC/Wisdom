### frontend
export NODE_OPTIONS=--openssl-legacy-provider
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-treebeard
npm install @mui/x-data-grid
npm install react-markdown
npm install react-pro-sidebar
npm install lodash


### backend
flask run
npx create-react-app frontend
pip install SQLAlchemy Flask-SQLAlchemy
npm install http-proxy-middleware --save
pip install Flask-Migrate
pip install markdown
npm install axios 


### database
sqlite3 blog_database.db
.tables     <!-- return ... -->
.schema ...
SELECT * FROM ...
.exit


CREATE TABLE Posts (
    post_id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    number_of_views INTEGER,
    tag TEXT,
);

CREATE TABLE SearchHistory (
    search_id INTEGER PRIMARY KEY,
    search_query TEXT,
    timestamp DATETIME
);
- get all
    - Frontend
        - nothing
    - Bakcend
        - 
        - 
        - 
- get single
    - Frontend
        - post_id
    - Bakcend
        - 
        - 
        - 
- post
    - Frontend
        - 
    - Bakcend
        - 
        - 
        - 
- put
    - Frontend
        - 
    - Bakcend
        - 
        - 
        - 
- delete
    - Frontend
        - post_id
    - Bakcend
        - 
        - 
        - 