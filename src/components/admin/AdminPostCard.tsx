"use client";

import { Trash2, Calendar, User as UserIcon, Heart, MessageSquare } from "lucide-react";
import { getRelativeTime } from "@/utils/customData";
import Button from "@/components/ui/Button";

interface AdminPostCardProps {
  post: {
    _id: string;
    content: string;
    author: string;
    createdAt: Date;
    likes?: string[];
    comments?: any[];
  };
  onDelete: (post: any) => void;
}

export default function AdminPostCard({ post, onDelete }: AdminPostCardProps) {
  return (
    <div className="group w-full flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-background border border-foreground/10 rounded-2xl hover:border-foreground/30 hover:shadow-2xl transition-all duration-300">
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
          {post.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
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

      <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform md:translate-x-2 group-hover:translate-x-0">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(post)}
          className="rounded-xl h-12 w-12 p-0 shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
        >
          <Trash2 size={22} />
        </Button>
      </div>
    </div>
  );
}
