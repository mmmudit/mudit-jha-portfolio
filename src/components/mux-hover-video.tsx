"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export interface MuxHoverVideoProps {
  playbackId?: string;
  thumbTime?: number;
  posterImage?: string;
  alt: string;
  isHovered: boolean;
  priority?: boolean;
  gradient?: string;
  className?: string;
}

export function MuxHoverVideo({
  playbackId,
  thumbTime = 0,
  posterImage,
  alt,
  isHovered,
  priority = false,
  gradient = "from-zinc-200 to-zinc-300",
  className = "",
}: MuxHoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Compute Mux high-res thumbnail URL if playbackId is present
  const muxThumbnailUrl = playbackId
    ? `https://image.mux.com/${playbackId}/thumbnail.webp?time=${thumbTime}&width=1200&fit_mode=smartcrop`
    : undefined;

  const displayImage = posterImage || muxThumbnailUrl;
  const canPlayVideo = Boolean(playbackId && !prefersReducedMotion);

  // Initialize Mux Data tracking via Mux's official hosted script (zero bundle overhead)
  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_MUX_ENV_KEY;
    const video = videoRef.current;
    if (!video || !playbackId || !envKey || typeof window === "undefined") return;

    let isDestroyed = false;

    function attachMuxData() {
      const globalMux = (window as unknown as { mux?: { monitor: (el: HTMLVideoElement, opts: unknown) => void; destroy: (el: HTMLVideoElement) => void } }).mux;
      if (globalMux && video && !isDestroyed) {
        try {
          globalMux.monitor(video, {
            debug: false,
            data: {
              env_key: envKey,
              video_id: playbackId,
              video_title: alt || "Project Card Preview",
              video_stream_type: "on-demand",
              player_name: "Portfolio Project Card Preview",
              player_init_time: Date.now(),
            },
          });
        } catch {
          // Graceful fallback
        }
      }
    }

    const existingScript = document.querySelector('script[src*="src.litix.io"]');
    if ((window as unknown as { mux?: unknown }).mux) {
      attachMuxData();
    } else if (existingScript) {
      existingScript.addEventListener("load", attachMuxData);
    } else {
      const script = document.createElement("script");
      script.src = "https://src.litix.io/core/4/mux.js";
      script.async = true;
      script.onload = attachMuxData;
      document.head.appendChild(script);
    }

    return () => {
      isDestroyed = true;
      const globalMux = (window as unknown as { mux?: { destroy: (el: HTMLVideoElement) => void } }).mux;
      if (globalMux && video) {
        try {
          globalMux.destroy(video);
        } catch {
          // Cleanup
        }
      }
    };
  }, [playbackId, alt]);

  // Autoplay video on mount / when available
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canPlayVideo) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback until user interaction
      });
    }
  }, [canPlayVideo]);

  return (
    <div className={`relative isolate size-full overflow-hidden ${className}`}>
      {/* Background Fallback Gradient / Shimmer */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} ${
          imageLoaded ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200 ease-out`}
      />

      {/* Static Poster Thumbnail (Mux generated or uploaded asset) */}
      {displayImage && (
        <Image
          src={displayImage}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setImageLoaded(true)}
          className={`absolute max-w-none object-cover size-full rounded-[26px] transition-all duration-300 ease-out pointer-events-none z-10 ${
            imageLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[4px] scale-[1.01]"
          } [@media(hover:hover)]:group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none`}
          style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
      )}

      {/* Autoplaying Mux Video Stream with Smooth Fade-in on load */}
      {canPlayVideo && playbackId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isVideoReady && hasStartedPlaying ? 1 : 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 size-full z-20 pointer-events-none overflow-hidden rounded-[26px]"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            onCanPlay={() => {
              setIsVideoReady(true);
            }}
            onPlaying={() => {
              setIsVideoReady(true);
              setHasStartedPlaying(true);
            }}
            className="size-full object-cover rounded-[26px] transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            aria-label={`${alt} video preview`}
          >
            {/* Native HLS stream */}
            <source src={`https://stream.mux.com/${playbackId}.m3u8`} type="application/x-mpegURL" />
            {/* Progressive MP4 high-res fallback */}
            <source src={`https://stream.mux.com/${playbackId}/high.mp4`} type="video/mp4" />
            <source src={`https://stream.mux.com/${playbackId}/medium.mp4`} type="video/mp4" />
          </video>
        </motion.div>
      )}
    </div>
  );
}
