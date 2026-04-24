"use client";

import { Authenticated } from "@refinedev/core";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated key="admin-auth" redirectOnFail="/login">
      {children}
    </Authenticated>
  );
}