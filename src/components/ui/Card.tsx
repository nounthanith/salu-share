import { getRelativeTime } from "@/utils/customData";
import { MessageCircle, Heart, User } from "lucide-react";
import { IComment } from "@/models/post.model";
import { useEffect, useState } from "react";
import { getVisitorId } from "@/utils/fingerprint";

export default function Card({
  content,
  author,
  comments = [],
  likes = [],
  createdAt,
  onLike,
  onComment,
}: {
  content: string;
  author: string;
  comments?: IComment[];
  likes?: string[];
  createdAt: Date;
  onLike?: () => void;
  onComment?: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (likes && visitorId) {
      setIsLiked(likes.includes(visitorId)); 
    }
  }, [likes]);

  return (
    <div className="space-y-3 border-b border-dashed py-4 hover:bg-foreground/5 transition-colors px-2">
      <div className="flex items-center gap-3">
        <div className="border border-foreground/20 rounded-full p-2 bg-foreground/5 shadow-sm">
          <User size={20} className="opacity-70" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">{author}</p>
          <p className="text-xs opacity-50 font-light">{getRelativeTime(createdAt)}</p>
        </div>
      </div>
      
      <div className="py-1">
        <p className="leading-relaxed text-[15px] opacity-90 whitespace-pre-wrap">{content}</p>
      </div>

      <div className="flex items-center gap-6 pt-1">
        <button 
          onClick={onComment}
          className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 hover:text-blue-500 transition-all group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-blue-500/10">
            <MessageCircle size={16} />
          </div>
          <span className="font-medium">{comments.length} Comments</span>
        </button>

        <button 
          onClick={onLike} 
          className={`flex items-center gap-2 text-xs transition-all group ${
            isLiked ? "text-red-500 opacity-100" : "opacity-60 hover:opacity-100 hover:text-red-500"
          }`}
        >
          <div className={`p-1.5 rounded-full ${isLiked ? "bg-red-500/10" : "group-hover:bg-red-500/10"}`}>
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          </div>
          <span className="font-medium">{likes.length} Likes</span>
        </button>
      </div>
    </div>
  );
}
