import { useCallback, useEffect, useRef, useState } from "react";
import { FACE_ANGLES } from "./faceAngles";
import "./FaceCapture.css";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

// Average brightness (0-255) of the centre of the picture – rejects very dark / washed-out photos.
const measureBrightness = (canvas) => {
  const probe = document.createElement("canvas");
  probe.width = 32;
  probe.height = 32;
  const ctx = probe.getContext("2d");
  ctx.drawImage(canvas, canvas.width * 0.25, canvas.height * 0.15, canvas.width * 0.5, canvas.height * 0.7, 0, 0, 32, 32);
  const { data } = ctx.getImageData(0, 0, 32, 32);
  let total = 0;
  for (let i = 0; i < data.length; i += 4) total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  return total / (data.length / 4);
};

// Simple centre-region variance heuristic to reject blank / no-face frames.
const measureFacePresence = (canvas) => {
  const probe = document.createElement("canvas");
  probe.width = 48;
  probe.height = 48;
  const ctx = probe.getContext("2d");
  ctx.drawImage(canvas, canvas.width * 0.3, canvas.height * 0.18, canvas.width * 0.4, canvas.height * 0.64, 0, 0, 48, 48);
  const { data } = ctx.getImageData(0, 0, 48, 48);
  let sum = 0;
  let sumSq = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    const y = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    sum += y;
    sumSq += y * y;
  }
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  return { mean, variance };
};

/**
 * Sample the eye region (upper-middle of the face oval) and return
 * mean brightness + variance. Used for blink detection.
 */
const sampleEyeRegion = (video) => {
  if (!video || !video.videoWidth) return null;
  const w = video.videoWidth;
  const h = video.videoHeight;
  // Eye band roughly sits in the upper third of the face oval
  const sx = Math.floor(w * 0.32);
  const sy = Math.floor(h * 0.22);
  const sw = Math.floor(w * 0.36);
  const sh = Math.floor(h * 0.18);

  const probe = document.createElement("canvas");
  probe.width = 40;
  probe.height = 20;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 40, 20);
  const { data } = ctx.getImageData(0, 0, 40, 20);
  let sum = 0;
  let sumSq = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    const y = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    sum += y;
    sumSq += y * y;
  }
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  return { mean, variance };
};

const canvasToShot = (canvas) =>
  new Promise((resolve, reject) => {
    const brightness = measureBrightness(canvas);
    const { variance } = measureFacePresence(canvas);
    let warning = "";
    if (brightness < 40) {
      warning = "Face not recognized clearly. The photo is too dark. Please move to a brighter place and retake.";
    } else if (brightness > 235) {
      warning = "Face not recognized clearly. The photo is overexposed. Avoid strong light behind you and retake.";
    } else if (variance < 180) {
      warning = "Face not recognized. Please centre your face inside the oval, ensure good lighting, and retake.";
    }
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Unable to create the photo"));
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        warning
      });
    }, "image/jpeg", 0.9);
  });

/* Unified live capture steps – one continuous session */
const CAPTURE_FLOW = [
  {
    key: "position",
    title: "Position your face",
    instruction: "Place your face inside the oval and look straight at the camera. Eyes must be clearly visible.",
    actionLabel: "Face is positioned",
    tipIcon: "◎",
    captures: null
  },
  {
    key: "blink",
    title: "Blink your eyes",
    instruction: "Blink both eyes clearly once or twice. We are watching your eyes – only then can you continue.",
    actionLabel: "Waiting for blink…",
    tipIcon: "👁",
    captures: null
  },
  {
    key: "front",
    title: "Front photo",
    instruction: "Look straight at the camera. We will capture your front photo automatically.",
    actionLabel: "Capture front",
    tipIcon: "◎",
    captures: "front"
  },
  {
    key: "left",
    title: "Turn head left",
    instruction: "Slowly turn your head to your left until your left ear is visible. Keep shoulders facing the camera.",
    actionLabel: "Turned left – capture",
    tipIcon: "←",
    captures: "left"
  },
  {
    key: "right",
    title: "Turn head right",
    instruction: "Slowly turn your head to your right until your right ear is visible. Keep shoulders facing the camera.",
    actionLabel: "Turned right – capture",
    tipIcon: "→",
    captures: "right"
  }
];

/* ───────────────────────── camera dialog (single continuous session) ───────────────────────── */
function CameraDialog({ captured, onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const blinkHistoryRef = useRef([]); // recent eye-region samples
  const blinkRafRef = useRef(null);
  const eyesClosedRef = useRef(false);
  const blinkDetectedAtRef = useRef(0);

  // phases: starting | step | countdown | review | saving | success | unavailable
  const [phase, setPhase] = useState("starting");
  const [flowIndex, setFlowIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [shot, setShot] = useState(null);
  const [message, setMessage] = useState("");
  const [flash, setFlash] = useState(false);
  const [sessionCaptured, setSessionCaptured] = useState({}); // angleKey -> {blob, url}
  const [pendingAngle, setPendingAngle] = useState(null);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [blinkStatus, setBlinkStatus] = useState(""); // feedback text during blink step

  const currentStep = CAPTURE_FLOW[flowIndex];
  const totalSteps = CAPTURE_FLOW.length;
  const doneAngles = Object.keys(sessionCaptured);
  const isBlinkStep = currentStep?.key === "blink";

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopBlinkMonitor = useCallback(() => {
    if (blinkRafRef.current) {
      cancelAnimationFrame(blinkRafRef.current);
      blinkRafRef.current = null;
    }
    blinkHistoryRef.current = [];
    eyesClosedRef.current = false;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMessage(window.isSecureContext ? "This browser cannot open the camera." : "The camera needs a secure (https) connection.");
        setPhase("unavailable");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setPhase("step");
        setFlowIndex(0);
        setMessage("");
        setBlinkDetected(false);
        setBlinkStatus("");
      } catch (error) {
        if (cancelled) return;
        setMessage(
          error?.name === "NotAllowedError"
            ? "Camera access was blocked. Allow the camera in your browser, or take a photo with your phone instead."
            : "No camera was found on this device."
        );
        setPhase("unavailable");
      }
    };
    start();
    return () => {
      cancelled = true;
      stopCamera();
      stopBlinkMonitor();
    };
  }, [stopCamera, stopBlinkMonitor]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && phase !== "saving") onClose(doneAngles.length > 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, phase, doneAngles.length]);

  /**
   * Active blink detection while on the blink step.
   * Watches the eye region for a rapid drop in variance / brightness
   * (eyes closing) followed by recovery (eyes opening).
   */
  useEffect(() => {
    if (phase !== "step" || !isBlinkStep || blinkDetected) {
      stopBlinkMonitor();
      return;
    }

    setBlinkStatus("Look at the camera and blink both eyes clearly…");
    blinkHistoryRef.current = [];
    eyesClosedRef.current = false;
    blinkDetectedAtRef.current = 0;

    let lastSample = 0;
    const SAMPLE_MS = 80;
    const HISTORY = 12;
    // Thresholds tuned for typical webcam conditions
    const CLOSE_DROP = 18; // variance drop that suggests eyes closed
    const BRIGHT_DROP = 12; // brightness drop
    const OPEN_RISE = 10;

    const tick = (now) => {
      if (now - lastSample < SAMPLE_MS) {
        blinkRafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastSample = now;

      const video = videoRef.current;
      const sample = sampleEyeRegion(video);
      if (!sample) {
        blinkRafRef.current = requestAnimationFrame(tick);
        return;
      }

      const hist = blinkHistoryRef.current;
      hist.push(sample);
      if (hist.length > HISTORY) hist.shift();

      if (hist.length >= 4) {
        const recent = hist.slice(-4);
        const older = hist.slice(0, Math.max(1, hist.length - 4));
        const avgVar = (arr) => arr.reduce((s, x) => s + x.variance, 0) / arr.length;
        const avgMean = (arr) => arr.reduce((s, x) => s + x.mean, 0) / arr.length;

        const oldVar = avgVar(older);
        const newVar = avgVar(recent);
        const oldMean = avgMean(older);
        const newMean = avgMean(recent);

        const varDrop = oldVar - newVar;
        const meanDrop = oldMean - newMean;

        // Eyes appear to close
        if (!eyesClosedRef.current && (varDrop > CLOSE_DROP || meanDrop > BRIGHT_DROP)) {
          eyesClosedRef.current = true;
          setBlinkStatus("Eyes closed – now open them again…");
        }

        // Eyes open again after being closed → blink confirmed
        if (eyesClosedRef.current && (newVar - oldVar > OPEN_RISE || newMean - oldMean > OPEN_RISE * 0.6)) {
          eyesClosedRef.current = false;
          blinkDetectedAtRef.current = Date.now();
          setBlinkDetected(true);
          setBlinkStatus("Blink detected ✓ Eyes captured. Continuing…");
          setMessage("");
          // Auto-advance after a short confirmation pause
          setTimeout(() => {
            setFlowIndex((i) => Math.min(i + 1, CAPTURE_FLOW.length - 1));
            setBlinkStatus("");
          }, 900);
          return; // stop monitoring
        }
      }

      blinkRafRef.current = requestAnimationFrame(tick);
    };

    blinkRafRef.current = requestAnimationFrame(tick);
    return () => stopBlinkMonitor();
  }, [phase, isBlinkStep, blinkDetected, stopBlinkMonitor]);

  // Reset blink state when leaving / re-entering the step
  useEffect(() => {
    if (!isBlinkStep) {
      setBlinkDetected(false);
      setBlinkStatus("");
    }
  }, [isBlinkStep]);

  const grabFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setMessage("Face not recognized. The camera is not ready yet. Please try again.");
      setPhase("step");
      return null;
    }
    const scale = Math.min(1, 960 / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    setFlash(true);
    setTimeout(() => setFlash(false), 220);
    return canvasToShot(canvas);
  }, []);

  const startCountdownAndCapture = (angleKey) => {
    setMessage("");
    setPendingAngle(angleKey);
    setPhase("countdown");
    let remaining = 3;
    setCount(remaining);
    const timer = setInterval(async () => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timer);
        const result = await grabFrame();
        if (!result) return;
        setShot(result);
        if (result.warning) {
          setMessage(result.warning);
        } else {
          setMessage("");
        }
        setPhase("review");
      } else {
        setCount(remaining);
      }
    }, 1000);
  };

  const advanceOrCapture = () => {
    if (!currentStep) return;

    // Blink step is blocked until real detection succeeds
    if (currentStep.key === "blink") {
      if (!blinkDetected) {
        setMessage("Blink not detected yet. Please look at the camera and blink both eyes clearly.");
        setBlinkStatus("Please blink both eyes clearly so we can capture them…");
        return;
      }
      // Already auto-advances on detection; this is a safety path
      if (flowIndex < totalSteps - 1) {
        setFlowIndex((i) => i + 1);
        setMessage("");
      }
      return;
    }

    if (currentStep.captures) {
      startCountdownAndCapture(currentStep.captures);
    } else {
      if (flowIndex < totalSteps - 1) {
        setFlowIndex((i) => i + 1);
        setMessage("");
      }
    }
  };

  const acceptShot = async () => {
    if (!shot || !pendingAngle) return;
    if (shot.warning) {
      setMessage(shot.warning + " Please retake the photo.");
      return;
    }
    setPhase("saving");
    setMessage("");
    try {
      await onCapture(pendingAngle, { blob: shot.blob, url: shot.url });
      setSessionCaptured((prev) => ({ ...prev, [pendingAngle]: { blob: shot.blob, url: shot.url } }));
    } catch (error) {
      setMessage(error.message || "Unable to save the photo. Please try again.");
      setPhase("review");
      return;
    }

    if (flowIndex < totalSteps - 1) {
      setShot(null);
      setPendingAngle(null);
      setFlowIndex((i) => i + 1);
      setPhase("step");
    } else {
      setPhase("success");
      setTimeout(() => onClose(true), 1400);
    }
  };

  const retakeCurrent = () => {
    if (shot?.url) URL.revokeObjectURL(shot.url);
    setShot(null);
    setMessage("");
    setPendingAngle(null);
    setPhase("step");
  };

  const pickFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !currentStep?.captures) return;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 960 / bitmap.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const result = await canvasToShot(canvas);
      setShot(result);
      setPendingAngle(currentStep.captures);
      setMessage(result.warning || "");
      setPhase("review");
    } catch {
      setMessage("That file could not be read as a photo. Please choose a JPG or PNG image.");
    }
  };

  const showVideo = ["starting", "step", "countdown"].includes(phase);

  return (
    <div
      className="fc-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && phase !== "saving") onClose(doneAngles.length > 0);
      }}
    >
      <section className="fc-dialog" role="dialog" aria-modal="true" aria-labelledby="fc-title">
        <header className="fc-dialog-head">
          <div>
            <span className="fc-eyebrow">
              {phase === "success" ? "Complete" : `Live verification · Step ${Math.min(flowIndex + 1, totalSteps)} of ${totalSteps}`}
            </span>
            <h2 id="fc-title">
              {phase === "success" ? "All photos captured" : currentStep?.title || "Live face capture"}
            </h2>
          </div>
          <button
            type="button"
            className="fc-close"
            aria-label="Close camera"
            disabled={phase === "saving"}
            onClick={() => onClose(doneAngles.length > 0)}
          >
            ×
          </button>
        </header>

        {/* Unified progress: Front / Left / Right */}
        <ol className="fc-steps" aria-label="Capture progress">
          {FACE_ANGLES.map((item) => {
            const done = captured.includes(item.key) || Boolean(sessionCaptured[item.key]);
            const isCurrent =
              (currentStep?.captures === item.key && (phase === "step" || phase === "countdown" || phase === "review")) ||
              (phase === "success" && done);
            return (
              <li key={item.key} className={`${isCurrent ? "is-current" : ""} ${done ? "is-done" : ""}`}>
                <span>{done ? "✓" : FACE_ANGLES.indexOf(item) + 1}</span>
                {item.label}
              </li>
            );
          })}
        </ol>

        {/* Flow progress strip */}
        {(phase === "step" || phase === "countdown") && (
          <div className="fc-liveness-bar" aria-label="Live face verification progress">
            {CAPTURE_FLOW.map((step, idx) => {
              const done = idx < flowIndex || (idx === flowIndex && phase === "countdown" && step.captures) || (step.key === "blink" && blinkDetected && idx <= flowIndex);
              const current = idx === flowIndex && phase === "step";
              return (
                <div key={step.key} className={`fc-liveness-step ${done ? "is-done" : ""} ${current ? "is-current" : ""}`}>
                  <span className="fc-liveness-icon">{done ? "✓" : step.tipIcon}</span>
                  <span className="fc-liveness-label">{step.title}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className={`fc-stage ${phase === "unavailable" ? "is-unavailable" : ""} ${phase === "success" ? "is-success" : ""}`}>
          <video ref={videoRef} className={`fc-video ${showVideo ? "" : "is-hidden"}`} autoPlay playsInline muted />
          {phase === "review" && shot && <img className="fc-shot" src={shot.url} alt="Captured photo" />}
          {phase === "success" && (
            <div className="fc-success-stage">
              <span className="fc-success-icon" aria-hidden="true">✓</span>
              <p>Front, left and right photos captured successfully.</p>
            </div>
          )}

          {showVideo && (
            <svg className="fc-guide" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <mask id="fc-hole">
                  <rect width="100" height="75" fill="#fff" />
                  <ellipse cx="50" cy="37" rx="19" ry="27" fill="#000" />
                </mask>
              </defs>
              <rect width="100" height="75" fill="rgba(8,18,38,.55)" mask="url(#fc-hole)" />
              <ellipse
                cx="50"
                cy="37"
                rx="19"
                ry="27"
                fill="none"
                stroke={
                  isBlinkStep && !blinkDetected
                    ? "#5b9dff"
                    : phase === "step" && !currentStep?.captures
                      ? "#5b9dff"
                      : "#f1c24b"
                }
                strokeWidth=".7"
                strokeDasharray="2.2 1.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}

          {phase === "step" && currentStep && (
            <div className={`fc-tip fc-tip-liveness fc-tip-${currentStep.key} ${isBlinkStep && blinkDetected ? "fc-tip-ok" : ""}`}>
              <b aria-hidden="true">{blinkDetected && isBlinkStep ? "✓" : currentStep.tipIcon}</b>
              {isBlinkStep && blinkStatus ? blinkStatus : currentStep.instruction}
            </div>
          )}
          {phase === "countdown" && pendingAngle && (
            <div className={`fc-tip fc-tip-${pendingAngle}`}>
              {pendingAngle === "left" && <b aria-hidden="true">←</b>}
              Hold still – capturing {pendingAngle} photo
              {pendingAngle === "right" && <b aria-hidden="true">→</b>}
            </div>
          )}

          {phase === "starting" && <div className="fc-overlay">Starting camera…</div>}
          {phase === "countdown" && (
            <div className="fc-countdown" aria-live="assertive">
              {count}
            </div>
          )}
          {phase === "saving" && <div className="fc-overlay">Saving photo…</div>}
          {flash && <div className="fc-flash" />}

          {phase === "unavailable" && (
            <div className="fc-fallback">
              <span className="fc-fallback-icon" aria-hidden="true">
                📷
              </span>
              <p>{message}</p>
              <label className="fc-btn fc-btn-primary">
                Take / choose a photo
                <input type="file" accept="image/*" capture="user" hidden onChange={pickFile} />
              </label>
            </div>
          )}
        </div>

        {/* Red alert / retake messages */}
        {phase !== "unavailable" && message && (
          <p className="fc-alert fc-retake" role="alert">
            {message}
          </p>
        )}
        {phase === "review" && shot?.warning && !message && (
          <p className="fc-alert fc-retake" role="alert">
            {shot.warning}
          </p>
        )}

        {phase === "step" && currentStep && (
          <p className="fc-hint fc-liveness-hint">
            {currentStep.key === "blink" ? (
              blinkDetected ? (
                <>Blink detected. Moving to front photo…</>
              ) : (
                <>
                  Live check: <strong>Blink both eyes</strong> – we are watching the eye region. No button needed.
                </>
              )
            ) : currentStep.captures ? (
              <>Ready to capture <strong>{currentStep.captures}</strong> photo. Follow the instruction then press the button.</>
            ) : (
              <>
                Live check {flowIndex + 1} of {totalSteps}: <strong>{currentStep.title}</strong>
              </>
            )}
          </p>
        )}
        {phase === "review" && !shot?.warning && (
          <p className="fc-hint">Photo looks good. Accept it to continue, or retake if needed.</p>
        )}

        <footer className="fc-actions">
          {phase === "success" ? (
            <button type="button" className="fc-btn fc-btn-primary" onClick={() => onClose(true)}>
              Done
            </button>
          ) : phase === "review" || phase === "saving" ? (
            <>
              <button type="button" className="fc-btn" onClick={retakeCurrent} disabled={phase === "saving"}>
                Retake
              </button>
              <button
                type="button"
                className="fc-btn fc-btn-primary"
                onClick={acceptShot}
                disabled={phase === "saving" || Boolean(shot?.warning)}
              >
                {phase === "saving" ? "Saving…" : "Use this photo & continue"}
              </button>
            </>
          ) : phase === "step" ? (
            <>
              <button type="button" className="fc-btn" onClick={() => onClose(doneAngles.length > 0)}>
                Cancel
              </button>
              {currentStep?.key === "blink" ? (
                <button
                  type="button"
                  className="fc-btn fc-btn-primary"
                  onClick={advanceOrCapture}
                  disabled={!blinkDetected}
                >
                  {blinkDetected ? "Continue" : "Waiting for blink…"}
                </button>
              ) : (
                <button type="button" className="fc-btn fc-btn-primary" onClick={advanceOrCapture}>
                  {currentStep?.actionLabel || "Continue"}
                </button>
              )}
            </>
          ) : phase === "countdown" ? (
            <button type="button" className="fc-btn" disabled>
              Hold still…
            </button>
          ) : phase === "unavailable" ? (
            <button type="button" className="fc-btn" onClick={() => onClose(false)}>
              Close
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  );
}

/* ───────────────────────── viewer ───────────────────────── */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fc-backdrop fc-lightbox" role="presentation" onMouseDown={onClose}>
      <figure onMouseDown={(event) => event.stopPropagation()}>
        <img src={item.src} alt={item.title} />
        <figcaption>
          {item.title}
          {item.capturedAt ? ` · ${formatTime(item.capturedAt)}` : ""}
        </figcaption>
        <button type="button" className="fc-close" aria-label="Close photo" onClick={onClose}>
          ×
        </button>
      </figure>
    </div>
  );
}

/* ───────────────────────── main component – SINGLE CARD ─────────────────────────
   photos:    { front|left|right: { src, capturedAt, capturedBy } }
   onCapture: async (angleKey, { blob, url }) => void   (throw an Error to show a message)
   readOnly:  only show the photos                                                     */
export default function FaceCapture({
  photos = {},
  onCapture,
  readOnly = false,
  error = "",
  title = "Face verification",
  subtitle
}) {
  const [dialog, setDialog] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [justDone, setJustDone] = useState(false);

  const capturedKeys = FACE_ANGLES.filter((item) => photos[item.key]?.src).map((item) => item.key);
  const count = capturedKeys.length;
  const isComplete = count === 3;
  const primaryPhoto = photos.front?.src || photos.left?.src || photos.right?.src || null;

  const closeDialog = (changed) => {
    setDialog(false);
    if (changed) {
      setJustDone(true);
      setTimeout(() => setJustDone(false), 3500);
    }
  };

  return (
    <div className="fc-root">
      <div className="fc-head">
        <div>
          <h3>{title}</h3>
          <p>
            {subtitle ||
              "Complete a single live face check: position, blink (eyes detected), then we automatically capture front, left and right photos in one session."}
          </p>
        </div>
        <span className={`fc-count ${isComplete ? "is-complete" : ""}`}>{count} of 3 captured</span>
      </div>
      <div className="fc-progress" aria-hidden="true">
        <i style={{ width: `${(count / 3) * 100}%` }} />
      </div>

      {/* ═══════════════ SINGLE CARD ═══════════════ */}
      <article className={`fc-single-card ${isComplete ? "is-complete" : ""}`}>
        <div className="fc-single-main">
          <button
            type="button"
            className="fc-single-preview"
            disabled={!primaryPhoto}
            onClick={() =>
              primaryPhoto &&
              setViewer({
                src: primaryPhoto,
                title: "Face verification photos",
                capturedAt: photos.front?.capturedAt || photos.left?.capturedAt || photos.right?.capturedAt
              })
            }
            aria-label={primaryPhoto ? "View captured photos" : "No photo captured yet"}
          >
            {primaryPhoto ? (
              <img src={primaryPhoto} alt="Primary face photo" />
            ) : (
              <span className="fc-silhouette fc-silhouette-front" aria-hidden="true">
                <i />
                <i />
              </span>
            )}
            {isComplete && (
              <em className="fc-check" aria-hidden="true">
                ✓
              </em>
            )}
          </button>

          <div className="fc-single-info">
            <div className="fc-angle-pills" aria-label="Capture status">
              {FACE_ANGLES.map((item) => {
                const photo = photos[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`fc-angle-pill ${photo?.src ? "is-done" : ""}`}
                    disabled={!photo?.src}
                    onClick={() =>
                      photo?.src &&
                      setViewer({ src: photo.src, title: item.title, capturedAt: photo.capturedAt })
                    }
                    title={photo?.src ? `View ${item.label}` : `${item.label} not captured`}
                  >
                    <span className="fc-pill-icon">{photo?.src ? "✓" : item.key === "front" ? "◎" : item.key === "left" ? "←" : "→"}</span>
                    <span className="fc-pill-label">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="fc-single-status">
              {isComplete
                ? "All three photos captured with live verification (blink + head turns)."
                : count === 0
                  ? "No photos yet. Start the live capture – eyes must blink and be detected before photos are taken."
                  : `${count} of 3 photos ready. Continue to finish the remaining angles.`}
            </p>

            {!readOnly && (
              <div className="fc-single-actions">
                <button
                  type="button"
                  className="fc-btn fc-btn-primary fc-start"
                  onClick={() => setDialog(true)}
                >
                  {count === 0 ? "Start live face verification" : isComplete ? "Retake all photos" : "Continue live capture"}
                </button>
              </div>
            )}
          </div>
        </div>

        {count > 0 && (
          <div className="fc-mini-thumbs">
            {FACE_ANGLES.map((item) => {
              const photo = photos[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`fc-mini-thumb ${photo?.src ? "has-photo" : ""}`}
                  disabled={!photo?.src}
                  onClick={() =>
                    photo?.src &&
                    setViewer({ src: photo.src, title: item.title, capturedAt: photo.capturedAt })
                  }
                  aria-label={photo?.src ? `View ${item.title}` : `${item.title} not captured`}
                >
                  {photo?.src ? (
                    <img src={photo.src} alt={item.title} />
                  ) : (
                    <span className={`fc-silhouette fc-silhouette-${item.key}`} aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  )}
                  <span className="fc-mini-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </article>

      {!readOnly && (
        <div className="fc-bar">
          <ul className="fc-rules">
            <li>Use a well-lit place and a plain background</li>
            <li>Remove cap, mask and sunglasses – eyes must be clearly visible</li>
            <li>One continuous session: position → blink (detected) → front → left → right</li>
            <li>If a photo is unclear you will be asked to retake that step only</li>
          </ul>
        </div>
      )}

      {justDone && isComplete && (
        <p className="fc-success" role="status">
          All three photos captured successfully with live verification.
        </p>
      )}
      {error && (
        <p className="fc-alert fc-retake" role="alert">
          {error}
        </p>
      )}

      {dialog && (
        <CameraDialog
          captured={capturedKeys}
          onCapture={onCapture}
          onClose={closeDialog}
        />
      )}
      {viewer && <Lightbox item={viewer} onClose={() => setViewer(null)} />}
    </div>
  );
}
