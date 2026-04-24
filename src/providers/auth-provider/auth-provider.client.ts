"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";

export const authProviderClient: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error };
    if (data?.session) {
      return { success: true, redirectTo: "/admin/products" };
    }
    return { success: false, error: { name: "LoginError", message: "Invalid credentials" } };
  },
  logout: async () => {
    await supabaseBrowserClient.auth.signOut();
    localStorage.clear();
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const { data } = await supabaseBrowserClient.auth.getSession();
    return { authenticated: !!data.session };
  },
  onError: async (error) => {
    if (error?.status === 401) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const { data } = await supabaseBrowserClient.auth.getUser();
    return data?.user ? { ...data.user, name: data.user.email } : null;
  },
};