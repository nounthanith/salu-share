/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/post.model";
import { pusherServer } from "@/lib/pusher";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await dbConnect();

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    return NextResponse.json({
      posts,
      hasMore: skip + posts.length < total,
      total
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { content, author } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await dbConnect();
    const newPost = await Post.create({
      content,
      author: author || "Anonymous",
    });

    await pusherServer.trigger("posts", "new-post", newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
