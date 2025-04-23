import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'MM-dd-yyyy') : '';
};

export const parseDisplayDate = (displayDate: string) => {
  // Convert from MM-dd-yyyy to yyyy-MM-dd
  const date = parse(displayDate, 'MM-dd-yyyy', new Date());
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
};
