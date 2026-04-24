"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";

export const authProviderClient: AuthProvider = {
  login: async ({ email, password }) => {
    // @ts-ignore: 强行绕过 VS Code 的类型误报
    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.session) {
      // @ts-ignore: 强行绕过 VS Code 的类型误报
      await supabaseBrowserClient.auth.setSession(data.session);
      return {
        success: true,
        redirectTo: "/admin/products", 
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    // @ts-ignore
    const { error } = await supabaseBrowserClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password }) => {
    try {
      // @ts-ignore
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/admin/products", 
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },
  check: async () => {
  const { data } = await supabaseBrowserClient.auth.getSession();
  const { session } = data;

  if (!session) {
    return {
      authenticated: false,
      redirectTo: "/login",
      // ⚠️ 核心修复：绝对不要在这里返回 error，让他安安静静地待在 login 页
    };
  }

  return {
    authenticated: true,
  };
},
  getPermissions: async () => {
    // @ts-ignore
    const user = await supabaseBrowserClient.auth.getUser();
    if (user) {
      return user.data.user?.role;
    }
    return null;
  },
  getIdentity: async () => {
    // @ts-ignore
    const { data } = await supabaseBrowserClient.auth.getUser();
    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }
    return null;
  },
  onError: async (error) => {
  console.error("Auth Error:", error);
  // 如果遇到 401 未授权，或者是别的严重错误，统一导向登录页，绝不去首页
  if (error?.status === 401 || error?.name === "AuthApiError") {
    return {
      logout: true,
      redirectTo: "/login", 
    };
  }
  return { error };
},
};