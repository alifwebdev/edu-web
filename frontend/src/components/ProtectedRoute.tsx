"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchMe } from "@/redux/slices/authSlice";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    // if no token redirect to login
    if (!auth.token && typeof window !== "undefined") {
      router.push("/login");
      return;
    }
    if (!auth.user) dispatch(fetchMe() as any);
  }, [auth.token, auth.user, dispatch, router]);

  if (!auth.user) return <div className="p-6">Loading...</div>;
  return <>{children}</>;
}
