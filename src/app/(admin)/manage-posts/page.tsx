/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dialog from "@/components/ui/Dialog";

import {
  Trash2,
  ShieldAlert,
  Calendar,
  User as UserIcon,
  Search,
  Filter,
  MessageSquare,
  Heart,
} from "lucide-react";
import { getRelativeTime } from "@/utils/customData";

export default function AdminManagePosts() {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Admin fetches a larger batch to scan easily
      const res = await fetch("/api/posts?limit=100");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchPosts();
    }
  }, [isAuthorized]);

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postToDelete._id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      if (res.ok) {
        setPostToDelete(null);
        fetchPosts();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete post");
      }
    } catch (err) {
      setError("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-foreground/5 rounded-3xl border border-foreground/10 space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-sm opacity-60 text-balance">
              Enter your secret key to manage the anonymous board.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthorized(true);
            }}
            className="space-y-4 text-left"
          >
            <Input
              type="password"
              label="Secret Key"
              placeholder="Enter admin secret..."
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" size="lg">
              Verify Secret
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Post Management
          </h1>
          <p className="opacity-60 text-sm">
            Monitor and delete anonymous content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-foreground/10 px-3 py-1.5 rounded-full border border-foreground/5">
            {posts?.length || 0} Total Posts
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAuthorized(false)}
          >
            Lock Admin
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Client
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity pointer-events-none">
            <Search size={18} />
          </div>
          <Input
            placeholder="Search by content or author..."
            className="pl-12 w-full h-12 rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="gap-2 shrink-0 h-12 px-6 rounded-2xl border-foreground/10"
        >
          <Filter size={16} /> Filters
        </Button>
      </div>

      <div className="w-full grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 w-full bg-foreground/5 animate-pulse rounded-2xl"
            />
          ))
        ) : filteredPosts.length === 0 ? (
          <div className="w-full text-center py-24 bg-foreground/5 rounded-3xl border border-dashed border-foreground/10">
            <p className="opacity-40 italic text-sm">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "No posts found."}
            </p>
          </div>
        ) : (
          filteredPosts.map((post: any) => (
            <div
              key={post._id}
              className="group w-full flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-background border border-foreground/10 rounded-2xl hover:border-foreground/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 text-xs opacity-50">
                  <span className="flex items-center gap-1.5 font-bold text-foreground opacity-100 bg-foreground/5 px-2.5 py-1 rounded-lg">
                    <UserIcon size={12} /> {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {getRelativeTime(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart size={12} /> {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={12} /> {post.comments?.length || 0}
                  </span>
                </div>
                <p className="text-[15px] opacity-90 leading-relaxed wrap-break-word">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform md:translate-x-2 group-hover:translate-x-0">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setPostToDelete(post)}
                  className="rounded-xl h-12 w-12 p-0 shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                >
                  <Trash2 size={22} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {postToDelete && (
        <Dialog
          isOpen={!!postToDelete}
          onClose={() => setPostToDelete(null)}
          title="Delete Post"
        >
          <div className="space-y-4">
            <p className="text-sm opacity-80 leading-relaxed">
              Are you sure you want to delete this post? This action is
              permanent and cannot be undone.
            </p>
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <p className="text-xs text-red-500 font-bold mb-2 uppercase tracking-wider">
                Content Preview
              </p>
              <p className="text-sm italic opacity-80 line-clamp-4 leading-relaxed">
                &quot;{postToDelete.content}&quot;
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20 animate-shake">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setPostToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete Post
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
