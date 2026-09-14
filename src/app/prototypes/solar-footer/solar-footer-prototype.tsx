"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AstralHaze } from "./astral-haze";
import { CoronaRays } from "./corona-rays";
import { GrazingRays } from "./grazing-rays";
import {
  CHICAGO_COORDINATES,
  formatChicagoTime,
  getSolarPosition,
} from "./solar-position";
import styles from "./solar-footer.module.css";

const variants = [
  { name: "Grazing", Component: GrazingRays },
  { name: "Corona", Component: CoronaRays },
  { name: "Haze", Component: AstralHaze },
] as const;

const initialControls = {
  intensity: 0.42,
  softness: 72,
  rayReach: 840,
  starStrength: 0.66,
  timeShift: 0,
};

type SolarStyle = CSSProperties & Record<`--${string}`, string>;

function describeElevation(elevation: number) {
  if (elevation >= 6) return "above horizon";
  if (elevation >= -6) return "civil twilight";
  return "below horizon";
}

export function SolarFooterPrototype({ initialVariant }: { initialVariant: number }) {
  const [current, setCurrent] = useState(initialVariant);
  const [mountKey, setMountKey] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const pickerRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const intensityValueRef = useRef<HTMLOutputElement>(null);
  const softnessValueRef = useRef<HTMLOutputElement>(null);
  const rayReachValueRef = useRef<HTMLOutputElement>(null);
  const starStrengthValueRef = useRef<HTMLOutputElement>(null);
  const timeValueRef = useRef<HTMLOutputElement>(null);
  const daylightRef = useRef(1);
  const controlsRef = useRef(initialControls);

  const applySolarPosition = useCallback((timeShift = controlsRef.current.timeShift) => {
    const root = rootRef.current;
    if (!root) return;

    const shiftedDate = new Date(Date.now() + timeShift * 3_600_000);
    const solar = getSolarPosition(shiftedDate);
    daylightRef.current = solar.daylight;
    root.style.setProperty("--sun-x", `${solar.edgeX.toFixed(3)}%`);
    root.style.setProperty("--sun-y", `${solar.edgeY.toFixed(3)}%`);
    root.style.setProperty("--sun-ray-angle", `${solar.rayAngle.toFixed(3)}deg`);
    root.style.setProperty("--sun-azimuth", `${solar.azimuth.toFixed(2)}deg`);
    root.style.setProperty(
      "--sun-opacity",
      (solar.daylight * controlsRef.current.intensity).toFixed(3),
    );

    if (statusRef.current) {
      const previewLabel = timeShift === 0 ? "live" : `${timeShift > 0 ? "+" : ""}${timeShift}h`;
      statusRef.current.textContent = `${formatChicagoTime(shiftedDate)} · ${previewLabel} · ${Math.round(
        solar.azimuth,
      )}° az · ${Math.round(solar.elevation)}° el · ${describeElevation(solar.elevation)}`;
    }
  }, []);

  const moveHighlight = useCallback(() => {
    const button = buttonRefs.current[current];
    const highlight = highlightRef.current;
    if (!button || !highlight) return;
    highlight.style.width = `${button.offsetWidth}px`;
    highlight.style.transform = `translateX(${button.offsetLeft}px)`;
  }, [current]);

  const setActive = useCallback((index: number) => {
    if (index < 0 || index >= variants.length) return;
    setCurrent(index);
    setMountKey((key) => key + 1);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(index + 1));
    window.history.replaceState(null, "", url);
  }, []);

  useLayoutEffect(() => {
    moveHighlight();
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => pickerRef.current?.setAttribute("data-ready", ""));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [moveHighlight]);

  useEffect(() => {
    applySolarPosition();
    const interval = window.setInterval(() => applySolarPosition(), 30_000);
    window.addEventListener("resize", moveHighlight);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", moveHighlight);
    };
  }, [applySolarPosition, moveHighlight]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const number = Number.parseInt(event.key, 10);
      if (number >= 1 && number <= variants.length) setActive(number - 1);
      else if (event.key === "ArrowRight") setActive((current + 1) % variants.length);
      else if (event.key === "ArrowLeft")
        setActive((current - 1 + variants.length) % variants.length);
      else if (event.key === "r" || event.key === "R") setMountKey((key) => key + 1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [current, setActive]);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    },
    [],
  );

  const updateControl = (name: keyof typeof initialControls, value: number) => {
    controlsRef.current[name] = value;
    const root = rootRef.current;
    if (!root) return;

    if (name === "intensity") {
      root.style.setProperty("--sun-intensity", value.toFixed(2));
      root.style.setProperty("--sun-opacity", (daylightRef.current * value).toFixed(3));
      if (intensityValueRef.current) intensityValueRef.current.value = value.toFixed(2);
    } else if (name === "softness") {
      root.style.setProperty("--sun-softness", `${value}px`);
      if (softnessValueRef.current) softnessValueRef.current.value = `${value}px`;
    } else if (name === "rayReach") {
      root.style.setProperty("--ray-reach", `${value}px`);
      if (rayReachValueRef.current) rayReachValueRef.current.value = `${value}px`;
    } else if (name === "starStrength") {
      root.style.setProperty("--star-strength", value.toFixed(2));
      if (starStrengthValueRef.current) starStrengthValueRef.current.value = value.toFixed(2);
    } else {
      if (timeValueRef.current) timeValueRef.current.value = `${value > 0 ? "+" : ""}${value}h`;
      applySolarPosition(value);
    }
  };

  const copyConfig = async () => {
    const { intensity, softness, rayReach, starStrength, timeShift } = controlsRef.current;
    await navigator.clipboard.writeText(
      `variant: ${variants[current].name} · intensity: ${intensity.toFixed(
        2,
      )} · softness: ${softness}px · ray reach: ${rayReach}px · starlight: ${starStrength.toFixed(2)} · time shift: ${timeShift}h · location: ${CHICAGO_COORDINATES.latitude}, ${CHICAGO_COORDINATES.longitude}`,
    );
    if (copyButtonRef.current) copyButtonRef.current.textContent = "Copied";
    if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(() => {
      if (copyButtonRef.current) copyButtonRef.current.textContent = "Copy config";
    }, 1_500);
  };

  const ActiveVariant = variants[current].Component;
  const solarStyle: SolarStyle = {
    "--sun-intensity": initialControls.intensity.toFixed(2),
    "--sun-softness": `${initialControls.softness}px`,
    "--ray-reach": `${initialControls.rayReach}px`,
    "--star-strength": initialControls.starStrength.toFixed(2),
    "--sun-x": "50%",
    "--sun-y": "0%",
    "--sun-ray-angle": "90deg",
    "--sun-azimuth": "180deg",
    "--sun-opacity": initialControls.intensity.toFixed(2),
  };

  return (
    <main ref={rootRef} className={styles.prototypeRoot} style={solarStyle}>
      <header className={styles.studyHeader}>
        <span>FOOTER LIGHT STUDY</span>
        <span ref={statusRef} className={styles.solarStatus} aria-live="polite">
          Calculating Chicago solar position…
        </span>
      </header>

      <div key={`${current}-${mountKey}`} className={styles.stage}>
        <ActiveVariant />
      </div>

      <aside className={styles.controlPanel} aria-label="Solar light controls">
        <div className={styles.controlHeading}>
          <span>Solar controls</span>
          <button
            ref={copyButtonRef}
            type="button"
            onClick={copyConfig}
            className={styles.copyButton}
          >
            Copy config
          </button>
        </div>

        <label className={styles.controlRow}>
          <span>Intensity</span>
          <output ref={intensityValueRef}>0.42</output>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.01"
            defaultValue="0.42"
            onInput={(event) => updateControl("intensity", Number(event.currentTarget.value))}
          />
        </label>
        <label className={styles.controlRow}>
          <span>Ray reach</span>
          <output ref={rayReachValueRef}>840px</output>
          <input
            type="range"
            min="360"
            max="1240"
            step="20"
            defaultValue="840"
            onInput={(event) => updateControl("rayReach", Number(event.currentTarget.value))}
          />
        </label>
        <label className={styles.controlRow}>
          <span>Starlight</span>
          <output ref={starStrengthValueRef}>0.66</output>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.66"
            onInput={(event) => updateControl("starStrength", Number(event.currentTarget.value))}
          />
        </label>
        <label className={styles.controlRow}>
          <span>Softness</span>
          <output ref={softnessValueRef}>72px</output>
          <input
            type="range"
            min="24"
            max="160"
            step="4"
            defaultValue="72"
            onInput={(event) => updateControl("softness", Number(event.currentTarget.value))}
          />
        </label>
        <label className={styles.controlRow}>
          <span>Preview time</span>
          <output ref={timeValueRef}>0h</output>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            defaultValue="0"
            onInput={(event) => updateControl("timeShift", Number(event.currentTarget.value))}
          />
        </label>
      </aside>

      <nav
        ref={pickerRef}
        className="proto-picker"
        aria-label="Prototype variants"
        data-position="top"
      >
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {variants.map((variant, index) => (
          <button
            key={variant.name}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            className="proto-picker-item"
            type="button"
            data-active={index === current ? "" : undefined}
            aria-current={index === current ? "true" : undefined}
            onClick={() => setActive(index)}
          >
            {variant.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          className="proto-picker-item proto-picker-replay"
          type="button"
          aria-label="Replay animation (R)"
          onClick={() => setMountKey((key) => key + 1)}
        >
          ↻
        </button>
      </nav>
    </main>
  );
}
