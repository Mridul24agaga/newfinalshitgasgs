import sys
import json
import praw
from collections import Counter
from urllib.parse import urlparse
import re

def extract_keywords_from_url(url):
    # Parse the URL and get the path
    parsed = urlparse(url)
    # Split the path into parts and remove empty strings
    path_parts = [p for p in parsed.path.split('/') if p]
    # Get the domain without TLD
    domain_parts = parsed.netloc.split('.')
    if len(domain_parts) > 2:
        domain = ''.join(domain_parts[:-1])
    else:
        domain = domain_parts[0]
    
    # Combine domain and path parts
    all_parts = [domain] + path_parts
    
    # Split CamelCase and remove special characters
    keywords = []
    for part in all_parts:
        # Split by special characters and numbers
        words = re.split('[^a-zA-Z]', part)
        # Split CamelCase
        for word in words:
            if word:
                # Split CamelCase into separate words
                camel_split = re.findall('[A-Z][^A-Z]*', word)
                if camel_split:
                    keywords.extend([w.lower() for w in camel_split])
                else:
                    keywords.append(word.lower())
    
    return keywords

def scrape_reddit(query, client_id, client_secret, user_agent):
    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent
    )

    keywords = []
    try:
        # Check if input is a URL
        if query.startswith('http'):
            initial_keywords = extract_keywords_from_url(query)
            search_query = ' OR '.join(initial_keywords)
        else:
            search_query = query
            initial_keywords = query.lower().split()

        # Search Reddit
        try:
            for submission in reddit.subreddit("all").search(search_query, limit=100, sort='relevance'):
                # Add submission title and text
                keywords.extend(submission.title.lower().split())
                keywords.extend(submission.selftext.lower().split())
                
                # Get comments
                submission.comments.replace_more(limit=0)
                for comment in submission.comments.list()[:10]:  # Limit to top 10 comments
                    if hasattr(comment, 'body'):
                        keywords.extend(comment.body.lower().split())
        except Exception as search_error:
            print(json.dumps({"error": f"Search error: {str(search_error)}"}), file=sys.stderr)
            # If search fails, at least return the initial keywords
            return initial_keywords

        # Filter and count keywords
        # Remove common words and keep only alphabetic words longer than 3 characters
        common_words = {'the', 'and', 'for', 'that', 'this', 'with', 'are', 'was', 'not', 'you', 'have', 'your'}
        keyword_counts = Counter(
            word for word in keywords 
            if len(word) > 3 
            and word.isalpha() 
            and word not in common_words
        )
        
        # Ensure initial keywords are included if they're relevant
        for word in initial_keywords:
            if len(word) > 3 and word.isalpha():
                if word not in keyword_counts:
                    keyword_counts[word] = 1
                else:
                    keyword_counts[word] += 5  # Give extra weight to original keywords

        # Get top keywords
        top_keywords = keyword_counts.most_common(100)
        
        print(json.dumps(dict(top_keywords)))
        return

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Invalid number of arguments"}), file=sys.stderr)
        sys.exit(1)

    query, client_id, client_secret = sys.argv[1:]
    user_agent = "SEOContentGenerator/1.0"
    scrape_reddit(query, client_id, client_secret, user_agent)

