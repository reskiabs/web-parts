import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "./ModalOtp.module.scss";

interface ModalOtpProps {
  email: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
}

const ModalOtp: React.FC<ModalOtpProps> = ({ email, onClose, onVerify }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (value: string, index: number): void => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLElement;
      nextInput?.focus();
    }

    // Auto submit when full
    const filledOtp = newOtp.join("");
    if (filledOtp.length === 6 && !newOtp.includes("")) {
      setTimeout(() => {
        onVerify(filledOtp);
        onClose();
      }, 300);
    }
  };

  const maskedEmail = email.replace(
    /^(.)(.*)(.@.)(.*)$/,
    (match, p1, p2, p3, p4) =>
      `${p1}${"*".repeat(p2.length)}${p3}${"*".repeat(p4.length)}`
  );

  const formattedTime = timer < 10 ? `0${timer}` : `${timer}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button> */}
        <div className={styles.header}>
          <div>
            <div className={styles.title}>Konfirmasi OTP</div>
            <div className={styles.subtitle}>
              Masukkan kode OTP yang telah terkirim ke email {maskedEmail}
            </div>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className={styles.otpInput}
              type="password"
            />
          ))}
        </div>

        <div className={styles.timerResend}>
          <span>
            Waktu yang tersisa <strong>00:{formattedTime}</strong>
          </span>
          <button disabled={timer > 0} onClick={() => setTimer(60)}>
            Kirim Ulang
          </button>
        </div>

        <p className={styles.terms}>
          Dengan mengisi Kode OTP, Anda telah menyetujui{" "}
          <a href="#">Syarat & Ketentuan</a> AkuSign
        </p>
      </div>
    </div>
  );
};

export default ModalOtp;
