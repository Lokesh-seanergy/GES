declare module "tailwindcss" {
  export type Config = any;
}

declare module "tailwindcss/defaultTheme" {
  export const fontFamily: {
    sans: string[];
    mono: string[];
    serif: string[];
  };
}
