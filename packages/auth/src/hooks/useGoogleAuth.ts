"use client";

import { useGoogleLogin } from "@react-oauth/google";

export function useGoogleAuth() {
  return useGoogleLogin({
    onSuccess(token) {
      console.log(token);
    },

    onError() {
      console.error("Erreur Google");
    },
  });
}