import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/global-config";

const MAINTENANCE_MESSAGE =
  "SellBook Media is temporarily unavailable. We’ll be back as soon as possible.";

const MAINTENANCE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Temporarily Unavailable | SellBookMedia</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }

    main {
      width: 100%;
      max-width: 620px;
      padding: 48px 28px;
      text-align: center;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
    }

    .brand {
      margin-bottom: 28px;
      font-size: 30px;
      font-weight: 800;
      color: #2563eb;
    }

    h1 {
      margin: 0 0 16px;
      font-size: 32px;
    }

    p {
      margin: 0;
      font-size: 18px;
      line-height: 1.6;
      color: #475569;
    }
  </style>
</head>

<body>
  <main>
    <div class="brand">SellBookMedia</div>
    <h1>Temporarily Unavailable</h1>
    <p>${MAINTENANCE_MESSAGE}</p>
  </main>
</body>
</html>`;

async function isEmergencyShutdown(): Promise<boolean> {
  // Yedek switch. Vercel env degisikligi redeploy gerektirir.
  if (process.env.EMERGENCY_SHUTDOWN === "true") {
    return true;
  }

  try {
    return (await get("emergencyShutdown")) === true;
  } catch (error) {
    // Config okunamazsa saglikli siteyi yanlislikla kapatma.
    console.error("Emergency shutdown config read failed:", error);
    return false;
  }
}

const MAINTENANCE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Retry-After": "300",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
};

export async function middleware(request: NextRequest) {
  const shutdown = await isEmergencyShutdown();

  if (!shutdown) {
    return NextResponse.next();
  }

  // API'leri de durdur.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        success: false,
        error: MAINTENANCE_MESSAGE,
      },
      {
        status: 503,
        headers: MAINTENANCE_HEADERS,
      }
    );
  }

  // Public site + admin dahil tum normal sayfalar.
  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      ...MAINTENANCE_HEADERS,
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$).*)",
  ],
};
