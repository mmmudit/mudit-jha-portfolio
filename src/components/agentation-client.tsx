"use client";

import { Agentation } from "agentation";

export default function AgentationClient() {
  if (typeof window === "undefined") return null;
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Agentation
      endpoint={"http://localhost:4747"}
      onSessionCreated={(sessionId: string) => {
        // session started
        console.log("Agentation session:", sessionId);
      }}
    />
  );
}
