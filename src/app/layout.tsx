import { DevtoolsProvider } from "@providers/devtools";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { dataProvider } from "@utils/supabase/dataProvider";
import { authProvider } from "@utils/supabase/authProvider";

export const metadata: Metadata = {
  title: "Ray's Lab - Admin",
  description: "Digital Asset Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body style={{ margin: 0 }}>
        <Suspense>
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
                  useNewQueryKeys: true,
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