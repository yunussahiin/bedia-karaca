"use client";

import { cn } from "@/lib/utils";

const FONT_FAMILY = "Amsterdam Handwriting, cursive";

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className,
  showSubtitle = true,
  size = "md",
}: LogoProps) {
  const sizes = {
    sm: { width: 140, height: 45, fontSize: 22, subtitleSize: 8 },
    md: { width: 170, height: 55, fontSize: 28, subtitleSize: 9 },
    lg: { width: 210, height: 65, fontSize: 34, subtitleSize: 11 },
  };

  const { width, height, fontSize, subtitleSize } = sizes[size];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("transition-colors", className)}
      aria-label="Bedia Karaca - Klinik Psikolog"
    >
      {/* Main Name - Amsterdam Handwriting */}
      <text
        x="50%"
        y={showSubtitle ? "42%" : "50%"}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground"
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: `${fontSize}px`,
        }}
      >
        Bedia Kalemzer Karaca
      </text>

      {/* Decorative swirl under name */}
      <path
        d={`M ${width * 0.15} ${height * 0.55} 
            C ${width * 0.3} ${height * 0.62}, ${width * 0.7} ${
          height * 0.62
        }, ${width * 0.85} ${height * 0.55}`}
        fill="none"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Subtitle */}
      {showSubtitle && (
        <text
          x="50%"
          y="82%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground"
          style={{
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontSize: `${subtitleSize}px`,
            fontWeight: 500,
            letterSpacing: "2.5px",
          }}
        >
          KLİNİK PSİKOLOG
        </text>
      )}
    </svg>
  );
}

// Sadece isim için minimal logo (icon)
export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={cn("transition-colors", className)}
      aria-label="BK"
    >
      {/* Circle background */}
      <circle cx="20" cy="20" r="18" className="fill-primary/10" />
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        className="stroke-primary/20"
        strokeWidth="1"
      />

      {/* BK initials */}
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-primary"
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: "18px",
        }}
      >
        BK
      </text>
    </svg>
  );
}

// Horizontal logo - navbar için (sadece text, ikon yok)
export function LogoHorizontal({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 300, height: 60, fontSize: 22, subtitleSize: 8 },
    md: { width: 350, height: 70, fontSize: 26, subtitleSize: 9 },
    lg: { width: 400, height: 80, fontSize: 30, subtitleSize: 10 },
  };

  const { width, height, fontSize, subtitleSize } = sizes[size];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("transition-colors", className)}
      aria-label="Bedia Kalemzer Karaca - Klinik Psikolog"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Name */}
      <text
        x="50%"
        y={height * 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground"
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: `${fontSize}px`,
        }}
      >
        Bedia Kalemzer Karaca
      </text>

      {/* Subtitle */}
      <text
        x="50%"
        y={height * 0.9}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-muted-foreground"
        style={{
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          fontSize: `${subtitleSize}px`,
          fontWeight: 500,
          letterSpacing: "1.5px",
        }}
      >
        KLİNİK PSİKOLOG
      </text>
    </svg>
  );
}

// Sadece text logo - footer veya minimal kullanım için
export function LogoText({
  className,
  size = "md",
}: Omit<LogoProps, "showSubtitle">) {
  const sizes = {
    sm: { fontSize: 20 },
    md: { fontSize: 26 },
    lg: { fontSize: 32 },
  };

  return (
    <span
      className={cn("transition-colors text-foreground", className)}
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: `${sizes[size].fontSize}px`,
      }}
    >
      Bedia Kalemzer Karaca
    </span>
  );
}
