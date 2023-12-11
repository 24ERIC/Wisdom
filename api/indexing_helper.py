import os
import json
import re

def extract_tags(content):
    match = re.search(r'^Tags:\s*(.+)$', content, re.MULTILINE)
    if match:
        return [tag.strip() for tag in match.group(1).split(',')]
    return []

def index_blog(directory):
    index = []
    base_url = "https://24eric.github.io/Wisdom/Blog/"
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                relative_path = os.path.relpath(root, directory)
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as md_file:
                    content = md_file.read()
                tags = extract_tags(content)
                # Convert file path to URL
                if relative_path != '.':
                    web_path = base_url + os.path.join(relative_path, file).replace('.md', '.html').replace('\\', '/')
                else:
                    web_path = base_url + file.replace('.md', '.html')
                index.append({'name': file, 'path': web_path, 'tags': tags})
                print(f'Indexed: {file}')
    return index




if __name__ == '__main__':
    blog_index = index_blog('Blog')

    with open('api/blog_index.json', 'w') as index_file:
        json.dump(blog_index, index_file)
