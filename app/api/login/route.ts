import { NextRequest, NextResponse } from "next/server";

const loginAttempts = new Map<
  string,
  {
    count: number;
    resetAt: number;
    lockedUntil?: number;
  }
>();

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkLoginLimit(ip: string) {
  const now = Date.now();

  const maxAttempts = 3;
const windowMs = 5 * 60 * 1000; // 5 דקות
const lockMs = 10 * 60 * 1000; // נעילה 10 דקות
  const record = loginAttempts.get(ip);

  if (record?.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      message: "בוצעו יותר מדי ניסיונות התחברות. נסה שוב מאוחר יותר.",
    };
  }

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });

    return { allowed: true };
  }

  record.count += 1;

  if (record.count > maxAttempts) {
    record.lockedUntil = now + lockMs;
    return {
      allowed: false,
      message: "בוצעו יותר מדי ניסיונות התחברות. נסה שוב מאוחר יותר.",
    };
  }

  return { allowed: true };
}

function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkLoginLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: limit.message },
        { status: 429 }
      );
    }

    const body = await request.json();
    const password = String(body.password || "");

    if (!process.env.ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD is missing");
      return NextResponse.json(
        { error: "אירעה שגיאה. נסה שוב מאוחר יותר." },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "סיסמה שגויה" },
        { status: 401 }
      );
    }

    resetLoginAttempts(ip);

    const response = NextResponse.json({
      success: true,
      message: "התחברת בהצלחה",
    });

    response.cookies.set("admin_session", "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 שעות
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "אירעה שגיאה. נסה שוב מאוחר יותר." },
      { status: 500 }
    );
  }
}
