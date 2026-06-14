"use client";

import { useState } from "react";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { getRelativeTime } from "@/utils/customData";

interface CommentDialogProps {
  post: any;
  onClose: () => void;
  onSubmitComment: (comment: string, author: string) => Promise<void>;
}

export default function CommentDialog({
  post,
  onClose,
  onSubmitComment,
}: CommentDialogProps) {
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmitComment(commentText, commentAuthor);
      setCommentText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={!!post} onClose={onClose} title="Comments">
      <div className="space-y-6">
        <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col-reverse">
          {post?.comments?.length === 0 ? (
            <p className="text-center opacity-40 py-4 text-sm italic">
              No comments yet. Be the first!
            </p>
          ) : (
            [...(post?.comments || [])]
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
                  <p className="text-sm opacity-90">
                    {comment.content.split(/(https?:\/\/[^\s]+)/g).map((part: string, i: number) =>
                      part.match(/^https?:\/\//) ? (
                        <a
                          key={i}
                          href={part}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline break-all"
                        >
                          {part}
                        </a>
                      ) : (
                        part
                      )
                    )}
                  </p>
                </div>
              ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
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
  );
}
