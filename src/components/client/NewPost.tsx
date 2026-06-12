"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { useState } from "react";

export default function NewPost() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please enter some content");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author: author.trim() || "Anonymous" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      // Clear form and go back
      setContent("");
      setAuthor("");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
        >
          <X size={20} />
        </button>
        <h1 className="text-lg font-bold">Create New Post</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Display Name (Optional)"
          placeholder="Anonymous"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={isLoading}
        />
        
        <Textarea
          label="Your Message"
          placeholder="What's on your mind? Be kind and stay anonymous..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError("");
          }}
          error={error}
          disabled={isLoading}
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="button"
            onClick={() => router.back()} 
            variant="ghost"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isLoading}
            className="px-8"
          >
            Post Anonymously
          </Button>
        </div>
      </form>
    </div>
  );
}
