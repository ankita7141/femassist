import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Muted autoplay — always works in every browser
    video.muted = true;
    video.play().catch(() => {});

    const onEnded = () => navigate('/home', { replace: true });
    video.addEventListener('ended', onEnded);

    // Safety redirect if video stalls or is missing
    const fallback = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 15000);

    return () => {
      clearTimeout(fallback);
      video.removeEventListener('ended', onEnded);
    };
  }, [navigate]);

  return (
    <div className="splash">
      <video
        ref={videoRef}
        className="splash__video"
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      <div className="splash__overlay">
        <button
          type="button"
          className="splash__skip"
          onClick={() => navigate('/home', { replace: true })}
        >
          Skip →
        </button>
      </div>
    </div>
  );
}