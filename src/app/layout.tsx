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
  title: "Ray's Lab",
  description: "个人数字产品矩阵管理后台",
  icons: {
    icon: "/favicon.ico",
  },
};

// 核心修复：整个文件只保留这一个默认导出 (RootLayout)
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 符合 Next.js 15 的异步要求
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        {/* 埋点脚本：用于追踪到底是谁下达了跳转回首页的指令 */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var oldPushState = history.pushState;
            history.pushState = function(state, title, url) {
                if (url === "/" || url === "https://www.rayslifelab.com/") {
                    console.error("拦截到非法回跳首页！堆栈信息：", new Error().stack);
                }
                return oldPushState.apply(history, arguments);
            };
          })();
        ` }} />
        
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