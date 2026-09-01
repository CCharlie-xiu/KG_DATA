import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { gateConfig, unlockSession, verifyCode } from "../lib/gates";
import "./EmailCodeGate.css";

gsap.registerPlugin(useGSAP);

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onVerified: () => void;
};

type SendPhase = "sending" | "sent";

export default function EmailCodeGate({ open, title, onClose, onVerified }: Props) {
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(gateConfig.ttlSeconds);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [phase, setPhase] = useState<SendPhase>("sending");
  const [sentAt, setSentAt] = useState(0);
  const maskRef = useRef<HTMLDivElement>(null);
  const sendTimer = useRef<number>(0);

  const startSend = (isResend: boolean) => {
    window.clearTimeout(sendTimer.current);
    setPhase("sending");
    setError("");
    setFlash("");
    setCode("");
    sendTimer.current = window.setTimeout(() => {
      setPhase("sent");
      setSentAt(Date.now());
      setLeft(gateConfig.ttlSeconds);
      setFlash(isResend ? "验证码已重新发送" : "");
    }, isResend ? 900 : 720);
  };

  useEffect(() => {
    if (!open) {
      window.clearTimeout(sendTimer.current);
      return;
    }
    startSend(false);
    return () => window.clearTimeout(sendTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on open
  }, [open]);

  useEffect(() => {
    if (!open || phase !== "sent" || left <= 0) return;
    const timer = window.setInterval(() => {
      const next = Math.max(0, gateConfig.ttlSeconds - Math.floor((Date.now() - sentAt) / 1000));
      setLeft(next);
    }, 250);
    return () => window.clearInterval(timer);
  }, [open, sentAt, left, phase]);

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(""), 2600);
    return () => window.clearTimeout(t);
  }, [flash]);

  useGSAP(
    () => {
      if (!open || !maskRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(maskRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(
        ".gate-card",
        { y: 28, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.46, ease: "power3.out" },
      );
    },
    { dependencies: [open], scope: maskRef },
  );

  if (!open) return null;

  const submit = () => {
    if (phase !== "sent") return;
    if (!verifyCode(code)) {
      setError("验证码不正确或已失效，请重试");
      return;
    }
    unlockSession();
    onVerified();
  };

  const resend = () => {
    if (left > 0 || phase === "sending") return;
    startSend(true);
  };

  return (
    <div ref={maskRef} className="gate-mask" onClick={onClose} role="presentation">
      <div
        className="gate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gate-kicker">邮箱验证</div>
        <h2 id="gate-title">{title}</h2>

        {phase === "sending" ? (
          <p className="gate-notice gate-notice--pulse">正在发送验证码…</p>
        ) : (
          <>
            <p className="gate-notice">{gateConfig.notice}</p>
            <p className="gate-email">
              发送至 <span>{gateConfig.emailMask}</span>
            </p>
          </>
        )}

        <p className="gate-hint">{gateConfig.hint}</p>
        {flash ? <p className="gate-flash">{flash}</p> : null}

        <input
          className="gate-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="······"
          autoFocus={phase === "sent"}
          disabled={phase !== "sent"}
          value={code}
          onChange={(e) => {
            setError("");
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        {error ? <p className="gate-error">{error}</p> : null}
        <div className="gate-actions">
          <button
            type="button"
            className="gate-go"
            onClick={submit}
            disabled={phase !== "sent" || code.length !== 6}
          >
            确认进入
          </button>
          <button
            type="button"
            className="gate-resend"
            onClick={resend}
            disabled={phase === "sending" || left > 0}
          >
            {phase === "sending" ? "发送中…" : left > 0 ? `${left}s 后可重发` : "重新获取"}
          </button>
        </div>
        <button type="button" className="gate-close" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}
