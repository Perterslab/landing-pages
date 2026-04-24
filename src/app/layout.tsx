"use client";
import { DevtoolsProvider } from "@providers/devtools";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import React, { Suspense } from "react";
import { dataProvider } from "@utils/supabase/dataProvider";
import { authProvider } from "@utils/supabase/authProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#0f172a" }}>
        <Suspense fallback={<div style={{ padding: "50px", color: "#fff", textAlign: "center" }}>System Loading...</div>}>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                authProvider={authProvider}
                resources={[
                  { name: "products", list: "/admin/products", create: "/admin/products/create", edit: "/admin/products/edit/:id" },
                  { name: "articles", list: "/admin/articles", create: "/admin/articles/create", edit: "/admin/articles/edit/:id" }
                ]}
                options={{ warnWhenUnsavedChanges: true }}
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