### frontend
export NODE_OPTIONS=--openssl-legacy-provider
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-treebeard
npm install @mui/x-data-grid
npm install react-markdown
npm install react-pro-sidebar
npm install lodash
npm install quill socket.io-client


### backend
flask run
npx create-react-app frontend
pip install SQLAlchemy Flask-SQLAlchemy
npm install http-proxy-middleware --save
pip install Flask-Migrate
pip install markdown
npm install axios 
pip install flask-socketio

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

INSERT INTO SearchHistory (search_query, timestamp) VALUES
('react', '2021-01-01 10:00:00'),
('website', '2021-01-02 11:00:00');