declare module "tailwindcss" {
  export interface Config {
    content: string[];
    theme: {
      extend?: Record<string, unknown>;
      [key: string]: unknown;
    };
    plugins?: unknown[];
    [key: string]: unknown;
  }
}

declare module "tailwindcss/defaultTheme" {
  export const fontFamily: {
    sans: string[];
    mono: string[];
    serif: string[];
  };
}
