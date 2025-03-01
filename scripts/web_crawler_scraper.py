import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import concurrent.futures
import time
import json

class WebCrawlerScraper:
    def __init__(self, start_url, max_pages=50, max_workers=10):
        self.start_url = start_url
        self.max_pages = max_pages
        self.max_workers = max_workers
        self.visited_urls = set()
        self.to_visit = [start_url]
        self.base_domain = urlparse(start_url).netloc
        self.data = []
        self.session = requests.Session()

    def is_valid(self, url):
        parsed = urlparse(url)
        return bool(parsed.netloc) and bool(parsed.scheme) and parsed.netloc == self.base_domain

    def crawl_and_scrape(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            while self.to_visit and len(self.visited_urls) < self.max_pages:
                futures = []
                for _ in range(min(self.max_workers, len(self.to_visit))):
                    if self.to_visit:
                        url = self.to_visit.pop(0)
                        if url not in self.visited_urls:
                            self.visited_urls.add(url)
                            futures.append(executor.submit(self.process_url, url))
                
                for future in concurrent.futures.as_completed(futures):
                    result = future.result()
                    if result:
                        self.data.append(result)

    def process_url(self, url):
        try:
            response = self.session.get(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }, timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                page_data = self.extract_page_data(url, soup)
                
                for link in soup.find_all('a', href=True):
                    new_url = urljoin(url, link['href'])
                    if self.is_valid(new_url) and new_url not in self.visited_urls and len(self.to_visit) < self.max_pages:
                        self.to_visit.append(new_url)
                
                return page_data
            
        except Exception as e:
            print(f"Error processing {url}: {str(e)}")
        
        return None

    def extract_page_data(self, url, soup):
        paragraphs = [p.get_text(strip=True) for p in soup.find_all('p') if p.get_text(strip=True)]
        return {
            'url': url,
            'title': soup.title.string if soup.title else "No title",
            'meta_description': soup.find('meta', {'name': 'description'})['content'] if soup.find('meta', {'name': 'description'}) else "",
            'paragraphs': paragraphs[:5]  # Limit to first 5 paragraphs for brevity
        }

    def get_data(self):
        return self.data

def main(url):
    crawler = WebCrawlerScraper(url, max_pages=10, max_workers=5)
    crawler.crawl_and_scrape()
    return json.dumps(crawler.get_data())

if __name__ == "__main__":
    import sys
    print(main(sys.argv[1]))

