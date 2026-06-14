/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Card from "../ui/Card";
import Dialog from "../ui/Dialog";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { User, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getVisitorId } from "@/utils/fingerprint";
import { getRelativeTime } from "@/utils/customData";

export default function GetPost() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Fetch latest version of this specific post to update local state
      // For now, we'll just refetch the current pages to keep it simple
      const res = await fetch(`/api/posts?page=1&limit=${posts.length}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const activePost =
    posts?.find((p) => p._id === selectedPost?._id) || selectedPost;

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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activePost) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${activePost._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          author: commentAuthor.trim() || "Anonymous",
        }),
      });
      if (res.ok) {
        setCommentText("");
        await refreshSinglePost(activePost._id);
      }
    } catch (err) {
      console.error("Comment failed:", err);
    } finally {
      setIsSubmitting(false);
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

      {activePost && (
        <Dialog
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title="Comments"
        >
          <div className="space-y-6">
            <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col-reverse">
              {activePost.comments.length === 0 ? (
                <p className="text-center opacity-40 py-4 text-sm italic">
                  No comments yet. Be the first!
                </p>
              ) : (
                [...activePost.comments]
                  .reverse()
                  .map((comment: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-foreground/5 p-3 mb-1 rounded-xl border border-foreground/5 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold">
                          {comment.author}
                        </span>
                        <span className="text-[10px] opacity-40">
                          {getRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{comment.content}</p>
                    </div>
                  ))
              )}
            </div>

            <form
              onSubmit={handleCommentSubmit}
              className="pt-4 border-t border-foreground/10 space-y-3"
            >
              <Input
                placeholder="Your name (optional)"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                size={16}
                className="text-xs py-1.5"
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isSubmitting}
                  disabled={!commentText.trim()}
                >
                  <MessageCircle size={16} />
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </div>
  );
}
