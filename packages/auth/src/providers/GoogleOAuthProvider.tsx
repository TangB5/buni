"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

type Props = {
  children: React.ReactNode;
  clientId: string;
};

export function BuniGoogleProvider({
  children,
  clientId,
}: Props) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}