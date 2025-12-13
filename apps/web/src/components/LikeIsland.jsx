import React, { useState, useEffect } from 'react';

export default function LikeIsland({ articleId }) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = `liked_${articleId}`;

  // Fetch initial likes and check if user has already liked
  useEffect(() => {
    // In a real app, you would fetch initial likes from your API
    const initialLikes = Math.floor(Math.random() * 100); // Placeholder
    setLikes(initialLikes);
    setIsLoading(false);

    if (localStorage.getItem(storageKey)) {
      setIsLiked(true);
    }
  }, [articleId, storageKey]);

  const handleLike = async () => {
    if (isLiked || isLoading) return;

    setIsLoading(true);
    // Optimistic UI update
    setLikes(likes + 1);
    setIsLiked(true);
    localStorage.setItem(storageKey, 'true');

    try {
      // In a real app, you would send a POST request to your API
      // const response = await fetch(`/api/articles/${articleId}/like`, { method: 'POST' });
      // if (!response.ok) { throw new Error('Failed to like'); }
      console.log('Liked article:', articleId);
    } catch (error) {
      // Revert optimistic update on failure
      setLikes(likes);
      setIsLiked(false);
      localStorage.removeItem(storageKey);
      console.error('Error liking article:', error);
    }
    setIsLoading(false);
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isLiked || isLoading}
      className={`px-4 py-2 rounded-button font-semibold transition-colors duration-200 ${isLiked ? 'bg-accent text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
    >
      ❤️ {isLoading ? '...' : likes} Likes
    </button>
  );
}
