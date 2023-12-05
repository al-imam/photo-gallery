import { useTheme as useT } from "next-themes";

export function useTheme() {
  const t = useT();

  const theme = ((t.theme === "system" ? t.systemTheme : t.theme) ?? "dark") as "dark" | "light";

  return { ...t, theme };
}
