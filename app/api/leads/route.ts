import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";

type Lead = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  organization: string;
  servicePlan?: string;
  createdAt: string;
  status: string;
};

const dataFilePath = path.join(process.cwd(), "data", "leads.json");

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  record.count += 1;

  if (record.count > maxRequests) {
    return true;
  }

  return false;
}

function sanitizeInput(value: unknown, maxLength = 120) {
  if (typeof value !== "string") return "";

  return value
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function normalizeServicePlan(value: unknown) {
  const plan = sanitizeInput(value, 30);
  const allowedPlans = ["basic", "professional", "full"];

  return allowedPlans.includes(plan) ? plan : "";
}

function getServicePlanLabel(plan: string | undefined) {
  switch (plan) {
    case "basic":
      return "מסלול בסיסי";
    case "professional":
      return "מסלול מקצועי";
    case "full":
      return "מסלול מלא";
    default:
      return "לא נבחר";
  }
}

function validateLead(input: {
  fullName: string;
  phone: string;
  email: string;
  organization: string;
}) {
  const errors: Record<string, string> = {};

  const cleanPhone = input.phone.replace(/\D/g, "");

  if (!input.fullName) {
    errors.fullName = "נא להזין שם מלא";
  } else if (!/^[א-תa-zA-Z\s.'"-]{2,80}$/.test(input.fullName)) {
    errors.fullName = "שם מלא מכיל תווים לא תקינים";
  }

  if (!cleanPhone) {
    errors.phone = "נא להזין מספר טלפון";
  } else if (!/^05\d{8}$/.test(cleanPhone)) {
    errors.phone = "מספר טלפון לא תקין";
  }

  if (!input.email) {
    errors.email = "נא להזין כתובת אימייל";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "כתובת אימייל לא תקינה";
  }

  if (!input.organization) {
    errors.organization = "נא להזין שם רשות / ארגון";
  } else if (!/^[א-תa-zA-Z0-9\s.'",()\/\-]{2,120}$/.test(input.organization)) {
    errors.organization = "שם הרשות / הארגון מכיל תווים לא תקינים";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanPhone,
  };
}

async function ensureDataFile() {
  const dir = path.dirname(dataFilePath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, "[]", "utf8");
  }
}

async function readLeads(): Promise<Lead[]> {
  await ensureDataFile();

  const raw = await fs.readFile(dataFilePath, "utf8");

  if (!raw.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]) {
  await ensureDataFile();
  await fs.writeFile(dataFilePath, JSON.stringify(leads, null, 2), "utf8");
}

async function sendLeadEmail(lead: Lead) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL WARNING: EMAIL_USER or EMAIL_PASS is missing");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"מגן ייעוץ" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `פנייה חדשה מ-${lead.fullName}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.7;">
        <h2>פנייה חדשה מהאתר</h2>
        <p><strong>שם:</strong> ${lead.fullName}</p>
        <p><strong>טלפון:</strong> ${lead.phone}</p>
        <p><strong>אימייל:</strong> ${lead.email}</p>
        <p><strong>רשות / ארגון:</strong> ${lead.organization}</p>
        <p><strong>מסלול נבחר:</strong> ${getServicePlanLabel(lead.servicePlan)}</p>
        <p><strong>תאריך:</strong> ${new Date(lead.createdAt).toLocaleString("he-IL")}</p>
      </div>
    `,
  });

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "נשלחו יותר מדי בקשות. נסה שוב בעוד דקה." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const fullName = sanitizeInput(body.fullName, 80);
    const phone = sanitizeInput(body.phone, 20);
    const email = sanitizeInput(body.email, 120).toLowerCase();
    const organization = sanitizeInput(body.organization, 120);
    const servicePlan = normalizeServicePlan(body.servicePlan);

    const validation = validateLead({
      fullName,
      phone,
      email,
      organization,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "יש שדות שדורשים תיקון",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const lead: Lead = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fullName,
      phone: validation.cleanPhone,
      email,
      organization,
      servicePlan,
      createdAt: new Date().toISOString(),
      status: "חדשה",
    };

    const leads = await readLeads();
    leads.unshift(lead);
    await writeLeads(leads);

    try {
      await sendLeadEmail(lead);
    } catch (error) {
      console.error("EMAIL ERROR:", error);
    }

    return NextResponse.json({
      success: true,
      message: "הפנייה נשלחה בהצלחה. נחזור אליך בהקדם.",
      lead: {
        id: lead.id,
        fullName: lead.fullName,
        organization: lead.organization,
        servicePlan: lead.servicePlan,
        createdAt: lead.createdAt,
        status: lead.status,
      },
    });
  } catch (error) {
    console.error("LEAD API ERROR:", error);

    return NextResponse.json(
      { error: "אירעה שגיאה. נסה שוב מאוחר יותר." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await readLeads();

    return NextResponse.json({
      leads: leads.map((lead) => ({
        id: lead.id,
        name: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        organization: lead.organization,
        servicePlan: getServicePlanLabel(lead.servicePlan),
        status: lead.status,
        createdAt: lead.createdAt.split("T")[0],
      })),
    });
  } catch (error) {
    console.error("LEAD FETCH ERROR:", error);
    return NextResponse.json({ leads: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = sanitizeInput(body.id, 80);
    const status = sanitizeInput(body.status, 30);

    const allowedStatuses = ["חדשה", "בטיפול", "נסגרה", "לא רלוונטית"];

    if (!id || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
    }

    const leads = await readLeads();

    const updatedLeads = leads.map((lead) =>
      lead.id === id ? { ...lead, status } : lead
    );

    await writeLeads(updatedLeads);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LEAD UPDATE ERROR:", error);
    return NextResponse.json({ error: "אירעה שגיאה" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = sanitizeInput(body.id, 80);

    if (!id) {
      return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
    }

    const leads = await readLeads();
    const updatedLeads = leads.filter((lead) => lead.id !== id);

    await writeLeads(updatedLeads);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LEAD DELETE ERROR:", error);
    return NextResponse.json({ error: "אירעה שגיאה" }, { status: 500 });
  }
}
