"use client";

import { useGoogleLogin } from "@react-oauth/google";

export function useGoogleAuth() {
  return useGoogleLogin({
    onSuccess(tokenResponse) {
      console.log("Google token received:", tokenResponse.access_token);
    },

    onError() {
      console.error("Erreur Google");
    },
  });
}