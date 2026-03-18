"use client";

import { Lightbulb, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";

export function ThemeModeMenuItem({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === "dark";
  const modeLabel = hydrated ? (isDark ? "Dark Mode" : "Light Mode") : "Theme Mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "bg-muted/60 text-foreground hover:bg-muted/80",
        className
      )}
      aria-label="Toggle theme mode"
    >
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-xl",
          !hydrated
            ? "bg-muted text-muted-foreground"
            : isDark
              ? "bg-indigo-500/15 text-indigo-400"
              : "bg-amber-500/15 text-amber-500"
        )}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
      </span>
      <span>{modeLabel}</span>
    </button>
  );
}
