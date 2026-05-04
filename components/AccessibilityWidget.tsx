"use client";

import { useEffect, useState } from "react";
import {
  Accessibility,
  Contrast,
  Eye,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

type AccessibilitySettings = {
  fontSize: number;
  contrast: boolean;
  grayscale: boolean;
  reduceMotion: boolean;
};

const defaultSettings: AccessibilitySettings = {
  fontSize: 0,
  contrast: false,
  grayscale: false,
  reduceMotion: false,
};

const storageKey = "magen-accessibility-settings";

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;

  root.classList.remove(
    "accessibility-font-1",
    "accessibility-font-2",
    "accessibility-contrast",
    "accessibility-grayscale",
    "accessibility-reduce-motion",
  );

  if (settings.fontSize > 0) {
    root.classList.add(`accessibility-font-${settings.fontSize}`);
  }

  if (settings.contrast) root.classList.add("accessibility-contrast");
  if (settings.grayscale) root.classList.add("accessibility-grayscale");
  if (settings.reduceMotion) root.classList.add("accessibility-reduce-motion");
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;

      const parsed = JSON.parse(saved) as Partial<AccessibilitySettings>;
      const nextSettings = {
        ...defaultSettings,
        ...parsed,
        fontSize: Math.min(Math.max(Number(parsed.fontSize) || 0, 0), 2),
      };

      setSettings(nextSettings);
      applySettings(nextSettings);
    } catch {
      applySettings(defaultSettings);
    }
  }, []);

  function updateSettings(nextSettings: AccessibilitySettings) {
    setSettings(nextSettings);
    applySettings(nextSettings);
    localStorage.setItem(storageKey, JSON.stringify(nextSettings));
  }

  function increaseFontSize() {
    updateSettings({
      ...settings,
      fontSize: Math.min(settings.fontSize + 1, 2),
    });
  }

  function decreaseFontSize() {
    updateSettings({
      ...settings,
      fontSize: Math.max(settings.fontSize - 1, 0),
    });
  }

  function resetSettings() {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem(storageKey);
  }

  return (
    <div className="accessibility-widget fixed bottom-6 right-6 z-[60]" dir="rtl">
      {isOpen && (
        <div className="mb-3 w-72 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-right text-white shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#22D3EE]">נגישות</p>
              <p className="mt-1 text-xs text-slate-400">התאמות תצוגה לאתר</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-[#22D3EE] hover:text-[#22D3EE]"
              aria-label="סגור תפריט נגישות"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={increaseFontSize}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-3 text-sm font-bold transition hover:bg-slate-700"
              >
                <Plus size={17} aria-hidden="true" />
                הגדל טקסט
              </button>
              <button
                type="button"
                onClick={decreaseFontSize}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-3 text-sm font-bold transition hover:bg-slate-700"
              >
                <Minus size={17} aria-hidden="true" />
                הקטן טקסט
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                updateSettings({ ...settings, contrast: !settings.contrast })
              }
              className={`inline-flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${
                settings.contrast
                  ? "bg-[#22D3EE] text-slate-950"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Contrast size={17} aria-hidden="true" />
                ניגודיות גבוהה
              </span>
              <span>{settings.contrast ? "פעיל" : "כבוי"}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateSettings({ ...settings, grayscale: !settings.grayscale })
              }
              className={`inline-flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${
                settings.grayscale
                  ? "bg-[#22D3EE] text-slate-950"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Eye size={17} aria-hidden="true" />
                גווני אפור
              </span>
              <span>{settings.grayscale ? "פעיל" : "כבוי"}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateSettings({
                  ...settings,
                  reduceMotion: !settings.reduceMotion,
                })
              }
              className={`inline-flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${
                settings.reduceMotion
                  ? "bg-[#22D3EE] text-slate-950"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              <span>עצירת אנימציות</span>
              <span>{settings.reduceMotion ? "פעיל" : "כבוי"}</span>
            </button>

            <button
              type="button"
              onClick={resetSettings}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-3 text-sm font-bold text-slate-300 transition hover:border-[#22D3EE] hover:text-[#22D3EE]"
            >
              <RotateCcw size={17} aria-hidden="true" />
              איפוס התאמות
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-[#22D3EE]/40 bg-[#22D3EE] text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-[#22D3EE]/30"
        aria-label={isOpen ? "סגור תפריט נגישות" : "פתח תפריט נגישות"}
        aria-expanded={isOpen}
      >
        <Accessibility size={28} aria-hidden="true" />
      </button>
    </div>
  );
}
