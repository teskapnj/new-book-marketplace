"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type LandingCtaEvent =
  | "books_landing_cta_clicked"
  | "cds_landing_cta_clicked"
  | "dvds_landing_cta_clicked"
  | "games_landing_cta_clicked";

interface LandingCtaLinkProps {
  href: string;
  eventName: LandingCtaEvent;
  ctaLocation: "header" | "hero" | "footer";
  className?: string;
  children: ReactNode;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function LandingCtaLink({
  href,
  eventName,
  ctaLocation,
  className,
  children,
}: LandingCtaLinkProps) {
  const handleClick = () => {
    if (typeof window === "undefined") return;

    window.gtag?.("event", eventName, {
      cta_location: ctaLocation,
    });
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}