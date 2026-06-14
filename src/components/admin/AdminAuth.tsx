"use client";

import { ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface AdminAuthProps {
  onVerify: (secret: string) => void;
}

export default function AdminAuth({ onVerify }: AdminAuthProps) {
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
            const form = new FormData(e.currentTarget);
            onVerify(form.get("secret") as string);
          }}
          className="space-y-4 text-left"
        >
          <Input
            name="secret"
            type="password"
            label="Secret Key"
            placeholder="Enter admin secret..."
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
