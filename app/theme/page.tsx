import { notFound } from "next/navigation";
import { ThemePreview } from "/components/theme-preview";

export default function ThemePreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <ThemePreview />;
}
