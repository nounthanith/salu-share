"use client";

import Pusher from "pusher-js";

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

export const pusherClient = typeof window !== "undefined" 
  ? new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  : null as any;
