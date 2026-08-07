"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    });

    const update = () => setTime(formatter.format(new Date()));
    update();

    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <p className="font-mono text-[16px] uppercase leading-4 text-rust-grey">
      <span className="mr-2 inline-flex size-3 items-center justify-center">
        <span className="size-1.5 rounded-full bg-status-green" />
      </span>
      {time || "—"} | Minneapolis, MN
    </p>
  );
}
