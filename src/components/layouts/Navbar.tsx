"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-background border-b border-border fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container max-w-5xl flex items-center justify-between mx-auto px-4 py-3">
        <Logo />
        <ThemeToggle />
      </div>
    </nav>
  );
}
