import { type ClassValue, clsx } from "clsx";
import { Fetcher } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Toast } from "@/components/ui/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToastParams(
  fetcher: Fetcher,
  errorMessage: string,
): Toast | undefined {
  if (fetcher.state !== "idle" || !fetcher.data) {
    return;
  }

  if (fetcher.data.status === "error") {
    return {
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: errorMessage,
    };
  } else if (fetcher.data.status === "success") {
    return {
      variant: undefined,
      title: "Action Successful",
      description: "Managed to approve all",
    };
  }
}
