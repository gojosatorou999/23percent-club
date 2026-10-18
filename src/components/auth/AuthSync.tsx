"use client";

import { useEffect } from "react";
import { initCloud } from "@/lib/store/store";

/** Starts cloud sync once per page load. Renders nothing; does nothing when Supabase isn't configured. */
export function AuthSync() {
  useEffect(() => {
    void initCloud();
  }, []);
  return null;
}
