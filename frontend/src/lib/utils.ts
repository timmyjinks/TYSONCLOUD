import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanEnvValue(value: string): string {
  return value.replace(/^[\r\n]+|[\r\n]+$/g, "");
}

export function formatEnvLines(env: Record<string, string>): string {
  return Object.entries(env)
    .map(([key, value]) => `${key}=${cleanEnvValue(value)}`)
    .join("\n");
}
