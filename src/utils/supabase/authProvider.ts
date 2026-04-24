import { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "./client";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error };
    return { success: true, redirectTo: "/admin/products" };
  },
  logout: async () => {
    const { error } = await supabaseBrowserClient.auth.signOut();
    if (error) return { success: false, error };
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const { data: { session } } = await supabaseBrowserClient.auth.getSession();
    if (session) return { authenticated: true };
    return { authenticated: false, redirectTo: "/login" };
  },
  getPermissions: async () => {
    const { data: { user } } = await supabaseBrowserClient.auth.getUser();
    return user?.role;
  },
  getIdentity: async () => {
    const { data: { user } } = await supabaseBrowserClient.auth.getUser();
    return user;
  },
  onError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      return { logout: true };
    }
    return { error };
  },
};