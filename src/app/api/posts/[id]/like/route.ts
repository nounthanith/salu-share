import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/post.model";
import { createHash } from "crypto";
import { pusherServer } from "@/lib/pusher";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { visitorId } = await request.json();

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
    }

    await dbConnect();

    // Get IP address from headers
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // Create a unique fingerprint by combining IP and VisitorID
    const fingerprint = createHash("sha256")
      .update(`${ip}-${visitorId}`)
      .digest("hex");

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(fingerprint);

    if (hasLiked) {
      // Unlike (optional behavior, or just return error)
      post.likes = post.likes.filter((f) => f !== fingerprint);
      await post.save();
      await pusherServer.trigger("posts", "post-updated", post);
      return NextResponse.json({ message: "Unliked", likesCount: post.likes.length });
    } else {
      // Like
      post.likes.push(fingerprint);
      await post.save();
      await pusherServer.trigger("posts", "post-updated", post);
      return NextResponse.json({ message: "Liked", likesCount: post.likes.length });
    }
  } catch (error: any) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
