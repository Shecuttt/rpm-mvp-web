/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // cegah hydration mismatch
  if (!mounted) {
    return (
      <Button size="icon" variant="ghost" aria-label="Toggle dark mode">
        <Moon />
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="ghost"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
