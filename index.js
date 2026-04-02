import os
import requests
from flask import Flask, render_template, request, redirect
from bs4 import BeautifulSoup
from whoosh.index import create_in, open_dir
from whoosh.fields import Schema, TEXT, ID
from whoosh.qparser import QueryParser

app = Flask(__name__)

# --- CONFIGURATION & SEARCH INDEX SETUP ---
INDEX_DIR = "indexdir"
if not os.path.exists(INDEX_DIR):
    os.mkdir(INDEX_DIR)
    schema = Schema(title=TEXT(stored=True), path=ID(stored=True), content=TEXT)
    create_in(INDEX_DIR, schema)

# --- PRIVACY & AGGREGATION LOGIC ---
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

def fetch_results(query):
    """
    Simulates DDG's 'Hybrid' approach by scraping public sources anonymously.
    In a production 1,500+ line app, you'd use APIs like Bing or JSON scrapers.
    """
    results = []
    # Using a privacy-friendly fallback or mock aggregator
    search_url = f"https://html.duckduckgo.com/html/?q={query}"
    headers = {"User-Agent": USER_AGENT}
    
    try:
        response = requests.get(search_url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        
        for link in soup.find_all('a', class_='result__a', limit=10):
            results.append({
                'title': link.get_text(),
                'url': link.get('href'),
                'snippet': "View result on source page..."
            })
    except Exception as e:
        print(f"Error fetching: {e}")
        
    return results

# --- BANGS LOGIC (The DuckDuckGo Signature) ---
BANGS = {
    "!w": "https://en.wikipedia.org/wiki/Special:Search?search=",
    "!yt": "https://www.youtube.com/results?search_query=",
    "!g": "https://www.google.com/search?q=",
    "!a": "https://www.amazon.com/s?k="
}

def handle_bangs(query):
    parts = query.split()
    if parts and parts[0] in BANGS:
        target_url = BANGS[parts[0]] + " ".join(parts[1:])
        return target_url
    return None

# --- ROUTES ---
@app.route('/')
def index():
    return '''
    <html>
        <body style="text-align:center; font-family:sans-serif; padding-top:100px;">
            <h1>DuckClone</h1>
            <form action="/search" method="get">
                <input type="text" name="q" style="width:400px; padding:10px;" placeholder="Search privately or use !w, !yt...">
                <button type="submit" style="padding:10px;">Search</button>
            </form>
            <p>Try: <b>!w Python (programming language)</b></p>
        </body>
    </html>
    '''

@app.route('/search')
def search():
    query = request.args.get('q', '')
    if not query:
        return redirect('/')

    # Check for Bangs
    bang_url = handle_bangs(query)
    if bang_url:
        return redirect(bang_url)

    # Get Results
    results = fetch_results(query)
    
    # Simple HTML Response
    res_html = f"<h2>Results for: {query}</h2><hr>"
    for r in results:
        res_html += f"<div><h3><a href='{r['url']}'>{r['title']}</a></h3><p>{r['url']}</p></div>"
    
    return res_html

if __name__ == '__main__':
    app.run(debug=True, port=5000)
