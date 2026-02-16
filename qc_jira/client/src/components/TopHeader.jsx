// export default TopHeader;
import React, { useEffect, useRef, useState } from "react";

// ✅ Define launchDate once outside the component
const launchDate = new Date("2025-07-15T00:00:00");

const TopHeader = () => {
  const topbarRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // ✅ Update current time every second
  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // ✅ Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = launchDate - now;
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  // ✅ Dynamic CSS var for topbar height (prevents overlap on mobile when it wraps)
  useEffect(() => {
    if (!topbarRef.current) return;
    const el = topbarRef.current;

    let raf = 0;
    const setVar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = el.getBoundingClientRect().height;
        const next = `${Math.ceil(h)}px`;
        const cur = getComputedStyle(document.documentElement).getPropertyValue(
          "--topbar-h",
        );
        if (cur.trim() !== next) {
          document.documentElement.style.setProperty("--topbar-h", next);
        }
      });
    };

    setVar();

    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
      cancelAnimationFrame(raf);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      ref={topbarRef}
      className="
        fixed top-0 left-0 w-full
        bg-gradient-to-r from-purple-600 via-pink-500 to-red-400
        text-white
        z-[60]
      "
    >
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex flex-col gap-2 sm:gap-2 md:flex-row md:items-center md:justify-between">
          {/* Left text */}
          <div className="min-w-0">
            <p className="text-[12px] sm:text-sm font-medium tracking-tight leading-snug">
              Project Management Tool for all your corporate needs!..
            </p>
          </div>

          {/* Right pills */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2">
            <div className="bg-black/20 rounded-full px-3 py-1 text-[11px] sm:text-xs whitespace-nowrap">
              Current Time:{" "}
              <span className="font-semibold">{formatTime(currentTime)}</span>
            </div>

            <div className="bg-black/20 rounded-2xl px-3 py-1 text-[11px] sm:text-xs">
              <span className="font-semibold">Emails:</span>{" "}
              <span className="break-all">
                gurupreeth@ecoders.co.in, igurupreeth@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
