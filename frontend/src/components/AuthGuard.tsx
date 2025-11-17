// src/components/AuthGuard.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchMe } from "@/redux/slices/authSlice";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    // fetchMe to populate user
    if (!auth.user) dispatch(fetchMe());
  }, [auth.user, dispatch, router]);

  // Render children while fetchMe is happening; we could show loader but keep simple
  return <>{children}</>;
}
