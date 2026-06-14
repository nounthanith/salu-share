"use client";

import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

interface AdminDeleteDialogProps {
  post: any;
  onClose: () => void;
  onDelete: () => void;
  error?: string;
  isDeleting?: boolean;
}

export default function AdminDeleteDialog({
  post,
  onClose,
  onDelete,
  error,
  isDeleting,
}: AdminDeleteDialogProps) {
  return (
    <Dialog isOpen={!!post} onClose={onClose} title="Delete Post">
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
            &quot;{post?.content}&quot;
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
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onDelete}
            isLoading={isDeleting}
          >
            Delete Post
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
