/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import CommentDialog from "./CommentDialog";
import { User } from "lucide-react";
import Link from "next/link";
import { getVisitorId } from "@/utils/fingerprint";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function GetPost() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Real-time updates for new posts
  useWebSocket("posts", "new-post", (newPost) => {
    setPosts((prev) => {
      // Avoid duplicates
      if (prev.some((p) => p._id === newPost._id)) return prev;
      return [newPost, ...prev];
    });
  });

  // Real-time updates for likes and comments
  useWebSocket("posts", "post-updated", (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const fetchPosts = useCallback(async (pageNum: number, isInitial = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      const data = await res.json();

      if (isInitial) {
        setPosts(data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      }
      setHasMore(data.hasMore);
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page, page === 1);
  }, [page, fetchPosts]);

  const refreshSinglePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts?page=1&limit=${posts.length}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const toggleLike = (postId: string, visitorId: string) =>
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: p.likes.includes(visitorId)
                ? p.likes.filter((id: string) => id !== visitorId)
                : [...p.likes, visitorId],
            }
          : p,
      ),
    );

  const handleLike = async (postId: string) => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    toggleLike(postId, visitorId);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      });
      if (!res.ok) toggleLike(postId, visitorId);
    } catch (err) {
      toggleLike(postId, visitorId);
      console.error("Like failed:", err);
    }
  };

  const handleCommentSubmit = async (comment: string, author: string) => {
    if (!selectedPost) return;
    const res = await fetch(`/api/posts/${selectedPost._id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: comment,
        author: author.trim() || "Anonymous",
      }),
    });
    if (res.ok) {
      await refreshSinglePost(selectedPost._id);
    }
  };

  if (error)
    return (
      <div>
        <h1>Something went wrong</h1>
        <p className="text-xs">Error: {error}</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="border border-foreground/20 rounded-full p-2 bg-background shadow-sm">
          <User size={20} className="opacity-70" />
        </div>
        <Link className="flex-1" href="/posts/new">
          <div className="w-full px-4 py-2 rounded-xl bg-background border border-foreground/10 text-foreground/40 text-sm hover:border-foreground/20 transition-all cursor-text">
            What&apos;s on your mind?
          </div>
        </Link>
      </div>

      <div className="space-y-1">
        {posts.length === 0 && !loading ? (
          <div className="text-center py-20 opacity-30">
            <p>No posts yet. Start the conversation!</p>
          </div>
        ) : (
          posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div ref={lastPostElementRef} key={post._id}>
                  <Card
                    content={post.content}
                    author={post.author}
                    comments={post.comments}
                    likes={post.likes}
                    createdAt={post.createdAt}
                    onComment={() => setSelectedPost(post)}
                    onLike={() => handleLike(post._id)}
                  />
                </div>
              );
            } else {
              return (
                <Card
                  key={post._id}
                  content={post.content}
                  author={post.author}
                  comments={post.comments}
                  likes={post.likes}
                  createdAt={post.createdAt}
                  onComment={() => setSelectedPost(post)}
                  onLike={() => handleLike(post._id)}
                />
              );
            }
          })
        )}
      </div>

      {loading && (
        <div className="space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="space-y-3 border border-border/50 rounded-sm py-4 px-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-foreground/10 size-10" />
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-foreground/10" />
                  <div className="h-2 w-16 rounded bg-foreground/10" />
                </div>
              </div>
              <div className="py-1 space-y-2">
                <div className="h-3 w-full rounded bg-foreground/10" />
                <div className="h-3 w-3/4 rounded bg-foreground/10" />
              </div>
              <div className="flex items-center gap-6 pt-1">
                <div className="h-4 w-20 rounded bg-foreground/10" />
                <div className="h-4 w-16 rounded bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-xs opacity-30 py-4 italic">
          No more posts to show.
        </p>
      )}

      {selectedPost && (
        <CommentDialog
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSubmitComment={handleCommentSubmit}
        />
      )}
    </div>
  );
}
