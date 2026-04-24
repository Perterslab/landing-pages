"use client";

import { AuthPage } from "@components/auth-page";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    supabaseBrowserClient.auth.signOut();
    localStorage.clear();
  }, []);

  return (
    <AuthPage 
      type="login" 
      title={<h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>Ray&apos;s Lab</h1>}
    />
  );
}