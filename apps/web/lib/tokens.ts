export type TasteTokens = {
  id: string;
  url: string;
  /** The mood caption is the picker — people choose by vibe, not by token table. */
  mood: string;
  recipe: string;
  accent: string;
  accentInk: string;
  canvas: string;
  surface: string;
  border: string;
  ink: string;
  inkMuted: string;
  radius: number;
  /** Multiplier applied to every spacing value in the wall. */
  density: number;
  shadow: string;
  font: string;
  weightHeading: number;
  tracking: string;
};

export const TASTES: TasteTokens[] = [
  {
    id: "neobank",
    url: "stripe.com",
    mood: "Confident and modern",
    recipe: "fintech-trust-first/neobank",
    accent: "#635bff",
    accentInk: "#ffffff",
    canvas: "#ffffff",
    surface: "#ffffff",
    border: "#e6e6ef",
    ink: "#0a2540",
    inkMuted: "#556987",
    radius: 10,
    density: 1.08,
    shadow: "0 4px 16px rgba(10, 37, 64, 0.09)",
    font: "var(--font-geist-sans), system-ui, sans-serif",
    weightHeading: 650,
    tracking: "-0.02em",
  },
  {
    id: "devtool",
    url: "linear.app",
    mood: "Dark-first and quiet",
    recipe: "devtool-dark-first/core",
    accent: "#7c74ff",
    accentInk: "#ffffff",
    canvas: "#0d0e12",
    surface: "#15161c",
    border: "#25262f",
    ink: "#eceef4",
    inkMuted: "#8b8e9e",
    radius: 8,
    density: 0.9,
    shadow: "0 2px 10px rgba(0, 0, 0, 0.45)",
    font: "var(--font-geist-sans), system-ui, sans-serif",
    weightHeading: 560,
    tracking: "-0.015em",
  },
  {
    id: "institutional",
    url: "mercury.com",
    mood: "Boardroom conservative",
    recipe: "fintech-trust-first/institutional",
    accent: "#1c3d5a",
    accentInk: "#ffffff",
    canvas: "#f7f8f9",
    surface: "#ffffff",
    border: "#d8dde3",
    ink: "#11202e",
    inkMuted: "#5b6a78",
    radius: 4,
    density: 0.84,
    shadow: "0 1px 2px rgba(17, 32, 46, 0.1)",
    font: "var(--font-geist-sans), system-ui, sans-serif",
    weightHeading: 620,
    tracking: "-0.005em",
  },
  {
    id: "editorial",
    url: "vercel.com",
    mood: "High-contrast and severe",
    recipe: "saas-dense-dashboard/mono",
    accent: "#000000",
    accentInk: "#ffffff",
    canvas: "#ffffff",
    surface: "#ffffff",
    border: "#111111",
    ink: "#000000",
    inkMuted: "#6b6b6b",
    radius: 0,
    density: 1.16,
    shadow: "none",
    font: "var(--font-geist-mono), ui-monospace, monospace",
    weightHeading: 700,
    tracking: "-0.03em",
  },
];

/** Applies the Parametric Tweaker on top of an extracted baseline. */
export function tune(base: TasteTokens, radius: number, density: number): TasteTokens {
  return { ...base, radius, density };
}
