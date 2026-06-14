/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AdminAuth from "@/components/admin/AdminAuth";
import AdminPostCard from "@/components/admin/AdminPostCard";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";

import { Search, Filter } from "lucide-react";

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

  const handleVerify = (secret: string) => {
    setAdminSecret(secret);
    setIsAuthorized(true);
  };

  if (!isAuthorized) {
    return <AdminAuth onVerify={handleVerify} />;
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
            <AdminPostCard
              key={post._id}
              post={post}
              onDelete={setPostToDelete}
            />
          ))
        )}
      </div>

      <AdminDeleteDialog
        post={postToDelete}
        onClose={() => setPostToDelete(null)}
        onDelete={handleDelete}
        error={error}
        isDeleting={isDeleting}
      />
    </div>
  );
}
