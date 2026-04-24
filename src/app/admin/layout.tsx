import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // 拆除前端保安，直接渲染。安保全交给 middleware.ts 这道铁门。
  return <>{children}</>;
}