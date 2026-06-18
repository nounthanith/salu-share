"use client";

import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher-client";

export const useWebSocket = (channelName: string, eventName: string, callback: (data: any) => void) => {
  useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe(channelName);

    channel.bind(eventName, (data: any) => {
      callback(data);
    });

    return () => {
      pusherClient.unsubscribe(channelName);
      channel.unbind(eventName);
    };
  }, [channelName, eventName, callback]);
};
