"use client";

/**
 * Generates a simple browser fingerprint based on browser characteristics.
 * This is not 100% foolproof but effective for basic anonymous identification.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  const storageKey = "anonymous-visitor-id";
  const cachedId = localStorage.getItem(storageKey);
  
  if (cachedId) return cachedId;

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    // Add more entropy if needed
  ].join("|");

  // Simple hash function for the fingerprint string
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  const newId = Math.abs(hash).toString(16) + "-" + Math.random().toString(16).slice(2);
  localStorage.setItem(storageKey, newId);
  
  return newId;
}
