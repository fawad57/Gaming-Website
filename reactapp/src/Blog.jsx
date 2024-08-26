import React from "react";
import "./CSS/Blog.css";
import Mainheader from "./Mainheader";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Introduction to React",
      author: "John Doe",
      date: "2024-08-01",
      content:
        "React is a popular JavaScript library for building user interfaces, particularly single-page applications...",
    },
    {
      id: 2,
      title: "Understanding JavaScript Closures",
      author: "Jane Smith",
      date: "2024-08-05",
      content:
        "A closure is the combination of a function and the lexical environment within which that function was declared...",
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox",
      author: "Alice Brown",
      date: "2024-08-10",
      content:
        "CSS Grid and Flexbox are two powerful layout systems in CSS. Here's a comparison to help you decide which one to use...",
    },
  ];

  return (
    <div className="blog-page">
      <Mainheader />
      <div className="blog-content">
        <h1 className="main-heading">Blog</h1>
        <div className="posts-container">
          {posts.map((post) => (
            <div key={post.id} className="post-box">
              <h2>{post.title}</h2>
              <p className="post-meta">
                <strong>Author:</strong> {post.author} <br />
                <strong>Date:</strong>{" "}
                {new Date(post.date).toLocaleDateString()}
              </p>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
