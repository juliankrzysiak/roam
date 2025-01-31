import { Averia_Serif_Libre, Inter, Caveat } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const averiaSerifLibre = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-averia-serif-libre",
  display: "swap",
});
export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});
