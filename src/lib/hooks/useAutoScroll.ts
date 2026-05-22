"use client";

import { useEffect } from "react";

export function useAutoScroll(
  ref: any,
  dependency: any
) {
  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [dependency]);
}