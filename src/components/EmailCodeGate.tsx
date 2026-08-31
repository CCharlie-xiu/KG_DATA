import { useEffect, useState } from "react";
import { gateConfig, unlockSession, verifyCode } from "../lib/gates";
import "./EmailCodeGate.css";

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
    <div className="gate-mask" onClick={onClose} role="presentation">
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
          placeholder="六位验证码"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        {error ? <p className="gate-error">{error}</p> : null}
        <div className="gate-actions">
          <button type="button" className="btn" onClick={submit} disabled={code.length !== 6}>
            确认进入
          </button>
          <button type="button" className="gate-resend" onClick={resend} disabled={left > 0}>
            {left > 0 ? `${left}s 后可重新获取` : "重新获取"}
          </button>
        </div>
        <button type="button" className="gate-close" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}
