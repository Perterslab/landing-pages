"use client";

import { AuthPage } from "@components/auth-page";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { useEffect } from "react";

export default function Login() {
  // 进入登录页先强制清理，防止旧状态干扰
  useEffect(() => {
    const clearAuth = async () => {
      await supabaseBrowserClient.auth.signOut();
      localStorage.clear();
    };
    clearAuth();
  }, []);

  // 只管显示登录框，不再判断“如果没登录就跳走”
  return <AuthPage type="login" />;
}