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
    tag_id
    number of views

bloTags Table (for categorizing posts):

    tag_id (Primary Key)
    tag_name
    post id


number of blogtags
number of blogs

SearchHistory Table:

    search_id (Primary Key)
    search_query
    timestamp


# Design

- search
    - datagrid star + sort # of view

- blog
    - each tag is can be redirect to search
    - move search bar and list of tags into smaller component file
    - blog new and edit, left is input, right is view, can insert picture

- plan
    - website developement plan
    - blog add plan
    - tool add plan

    