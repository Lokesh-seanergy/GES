declare module "tailwindcss" {
  export interface Config {
    content: string[];
    theme: {
      extend: Record<string, unknown>;
    };
    plugins: unknown[];
  }
}

declare module "tailwindcss/defaultTheme" {
  export const fontFamily: {
    sans: string[];
    mono: string[];
    serif: string[];
  };
}

declare module 'tailwindcss/colors' {
  export const colors: Record<string, Record<string, string>>;
}
