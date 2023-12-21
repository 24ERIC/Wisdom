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

Posts Table (for blog posts):

    post_id (Primary Key)
    title
    content
    author_id (Foreign Key referencing Users Table)
    created_at
    updated_at
    tag_id (Foreign Key referencing Tags Table)

Tags Table (for categorizing posts):

    tag_id (Primary Key)
    tag_name

# Design



