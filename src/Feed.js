import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import './Feed.css';

// Your News API Key
const API_KEY = '10bef3d4a150490b8930ea7673b2fd79';

const Feed = () => {
  // State to hold articles and loading status
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1); // Page number to track pagination
  const [loading, setLoading] = useState(false); // Loading state

  // Intersection observer hook
  const { ref, inView } = useInView({
    threshold: 0.5, // Adjust threshold as needed
  });

  // Function to fetch articles from News API
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=technology&language=en&page=${page}&pageSize=10&apiKey=${API_KEY}`
      );
      const data = await response.json();
      if (data.articles) {
        setArticles((prevArticles) => [...prevArticles, ...data.articles]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setLoading(false);
    }
  }, [page]);

  // Effect to fetch articles when the component mounts or page changes
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Effect to load more articles when the observer comes into view
  useEffect(() => {
    if (inView && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading]);

  return (
    <div className="feed">
      {articles.map((article, index) => (
        <div key={index} className="article">
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
      {/* Ref for Intersection Observer */}
      <div ref={ref} className="loading-indicator">
        {loading && <div className="spinner">Loading...</div>}
      </div>
    </div>
  );
};

export default Feed;
