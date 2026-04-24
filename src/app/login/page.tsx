"use client";
export const dynamic = "force-dynamic"; // 核心修复

import { AuthPage } from "@refinedev/antd";

export default function Login() {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: { email: "", password: "" },
      }}
      rememberMe={false}
    />
  );
}