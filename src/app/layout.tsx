import { DevtoolsProvider } from "../providers/devtools";
import { ColorModeContextProvider } from "../contexts/color-mode";
import { authProviderClient } from "../providers/auth-provider/auth-provider.client";
import { dataProvider } from "../providers/data-provider";

import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@refinedev/antd/dist/reset.css";

import "@ant-design/v5-patch-for-react-19";

export const metadata: Metadata = {
  title: "My Digital Hub",
  description: "个人数字产品矩阵管理后台",
  icons: {
    icon: "/favicon.ico",
  },
};

// 【关键修复 1】：将函数改为 async 异步函数
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 【关键修复 2】：在 cookies() 前面加上 await (Next.js 15 新要求)
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <AntdRegistry>
              <ColorModeContextProvider defaultMode={defaultMode}>
                <DevtoolsProvider>
                  <Refine
                    routerProvider={routerProvider}
                    dataProvider={dataProvider}
                    notificationProvider={useNotificationProvider}
                    authProvider={authProviderClient}
                    resources={[
                      {
                        name: "products",
                        meta: {
                          label: "产品管理",
                        },
                        list: "/admin/products",
                        create: "/admin/products/create",
                        edit: "/admin/products/edit/:id",
                      }
                    ]}
                    options={{
                      syncWithLocation: true,
                      warnWhenUnsavedChanges: true,
                    }}
                  >
                    {children}
                    <RefineKbar />
                  </Refine>
                </DevtoolsProvider>
              </ColorModeContextProvider>
            </AntdRegistry>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}