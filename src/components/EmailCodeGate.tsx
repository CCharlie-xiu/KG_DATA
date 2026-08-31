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

export default function EmailCodeGate({ open, title, onClose, onVerified }: Props) {
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(gateConfig.ttlSeconds);
  const [error, setError] = useState("");
  const [sentAt, setSentAt] = useState(0);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setCode("");
    setError("");
    setSentAt(Date.now());
    setLeft(gateConfig.ttlSeconds);
  }, [open]);

  useEffect(() => {
    if (!open || left <= 0) return;
    const timer = window.setInterval(() => {
      const next = Math.max(0, gateConfig.ttlSeconds - Math.floor((Date.now() - sentAt) / 1000));
      setLeft(next);
    }, 250);
    return () => window.clearInterval(timer);
  }, [open, sentAt, left]);

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
    if (!verifyCode(code)) {
      setError("验证码不正确");
      return;
    }
    unlockSession();
    onVerified();
  };

  const resend = () => {
    if (left > 0) return;
    setSentAt(Date.now());
    setLeft(gateConfig.ttlSeconds);
    setError("");
    setCode("");
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
        <p className="gate-notice">{gateConfig.notice}</p>
        <p className="gate-hint">{gateConfig.hint}</p>
        <input
          className="gate-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        {error ? <p className="gate-error">{error}</p> : null}
        <div className="gate-actions">
          <button type="button" className="gate-go" onClick={submit} disabled={code.length !== 6}>
            确认进入
          </button>
          <button type="button" className="gate-resend" onClick={resend} disabled={left > 0}>
            {left > 0 ? `${left}s 后可重发` : "重新获取"}
          </button>
        </div>
        <button type="button" className="gate-close" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}
