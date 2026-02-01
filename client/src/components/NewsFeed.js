import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await axios.get("/api/news");
        setNews(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    const interval = setInterval(loadNews, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="news-card">Loading latest Olympic news…</div>;
  }

  return (
    <section className="news-feed">
      <h3 className="news-title">📰 Live Winter Olympics News</h3>
      <ul>
        {news.map((item, idx) => (
          <li key={idx}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
            <span className="news-meta">
              {new Date(item.published).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
