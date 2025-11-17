import api from "@/lib/api";
import type { User } from "@/types/api";

export type LoginResp = {
  access_token: string;
  user: User;
  expires_in?: number;
};

export async function loginRequest(email: string, password: string) {
  const res = await api.post<LoginResp>("/auth/login", { email, password });
  if (res.data.access_token)
    localStorage.setItem("token", res.data.access_token);
  return res.data;
}

export async function logoutRequest() {
  try {
    await api.post("/auth/logout");
  } catch {}
  localStorage.removeItem("token");
}

export async function meRequest() {
  const res = await api.get<User>("/auth/me");
  return res.data;
}
