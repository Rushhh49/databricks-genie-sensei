"use client";

import { useEffect, useState } from "react";

export function useLocalStorage(key: string, initial: any) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const existing = localStorage.getItem(key);

    if (existing) {
      setValue(JSON.parse(existing));
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}