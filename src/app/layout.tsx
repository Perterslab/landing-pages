"use client";
import { DevtoolsProvider } from "@providers/devtools";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import React, { Suspense } from "react";
import { dataProvider } from "@utils/supabase/dataProvider";
import { authProvider } from "@utils/supabase/authProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body style={{ margin: 0 }}>
        <Suspense fallback={<div style={{ padding: "20px", color: "#fff", background: "#0f172a" }}>系统加载中...</div>}>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "products",
                    list: "/admin/products",
                    create: "/admin/products/create",
                    edit: "/admin/products/edit/:id",
                  },
                  {
                    name: "articles",
                    list: "/admin/articles",
                    create: "/admin/articles/create",
                  }
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  // 修复点：删除了报错的 useNewQueryKeys 属性
                }}
              >
                {children}
                <RefineKbar />
              </Refine>
            </DevtoolsProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}