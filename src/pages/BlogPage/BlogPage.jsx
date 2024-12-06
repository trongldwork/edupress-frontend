import React from 'react';
import './BlogPage.css'; // Link đến file CSS

const BlogPage = () => {
  const posts = [
    {
      title: 'AI and the Future of Technology',
      content: 'The advancements in artificial intelligence are revolutionizing industries worldwide...',
      link: '#'
    },
    {
      title: 'How to Improve Your English Vocabulary',
      content: 'Learning new words is key to mastering any language, especially English...',
      link: '#'
    },
    {
      title: 'Understanding Machine Learning Algorithms',
      content: 'Machine learning is a subset of artificial intelligence that is making a significant impact...',
      link: '#'
    },
    {
      title: 'Top 10 English Idioms You Should Know',
      content: 'Idioms are an important part of any language, and English is no exception...',
      link: '#'
    },
    {
      title: 'Blockchain and its Applications',
      content: 'Blockchain technology has been transforming various sectors including finance...',
      link: '#'
    },
    {
      title: 'Natural Language Processing in AI',
      content: 'NLP is a crucial part of artificial intelligence and helps machines understand human language...',
      link: '#'
    },
    {
      title: 'The Rise of Quantum Computing',
      content: 'Quantum computing is set to change the way we solve complex problems that traditional computers cannot...',
      link: '#'
    },
    {
      title: 'English Grammar Tips for Beginners',
      content: 'Mastering the basics of English grammar is essential for clear communication...',
      link: '#'
    }
  ];

  return (
    <div className="blog-container">
      {posts.map((post, index) => (
        <div key={index} className={`card card-${index % 4 + 1}`}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <a href={post.link}>Read More</a>
        </div>
      ))}
    </div>
  );
};

export default BlogPage;
