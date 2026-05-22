"use client";

import { useEffect, useState } from "react";

export function StreamingText({
  text,
}: {
  text: string;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index));

      index++;

      if (index > text.length) {
        clearInterval(interval);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="whitespace-pre-wrap">
      {displayed}
    </div>
  );
}