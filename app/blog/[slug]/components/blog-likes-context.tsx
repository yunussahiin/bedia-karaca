"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BlogLikesContextType {
  likes: number;
  hasLiked: boolean;
  addLike: () => void;
}

const BlogLikesContext = createContext<BlogLikesContextType | undefined>(
  undefined
);

export function BlogLikesProvider({
  children,
  initialLikes = 0,
}: {
  children: ReactNode;
  initialLikes?: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  const addLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <BlogLikesContext.Provider value={{ likes, hasLiked, addLike }}>
      {children}
    </BlogLikesContext.Provider>
  );
}

export function useBlogLikes() {
  const context = useContext(BlogLikesContext);
  if (!context) {
    throw new Error("useBlogLikes must be used within BlogLikesProvider");
  }
  return context;
}
