"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Finishing GitHub sign in...");

  useEffect(() => {
    async function handleCallback() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      const errorDescription = url.searchParams.get("error_description");

      console.log("AUTH CALLBACK URL:", window.location.href);
      console.log("AUTH CODE:", code);
      console.log("AUTH ERROR:", error, errorDescription);

      if (error) {
        setMessage(`Auth error: ${errorDescription || error}`);
        return;
      }

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("exchangeCodeForSession error:", exchangeError);
          setMessage(`Auth exchange error: ${exchangeError.message}`);
          return;
        }

        window.location.replace("/");
        return;
      }

      // Important: for implicit/hash OAuth flow, Supabase may already process
      // the URL and store the session before this page sees the token.
      const tryGetSession = async () => {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("CALLBACK SESSION:", session);
        console.log("CALLBACK SESSION ERROR:", sessionError);

        if (session) {
          window.location.replace("/");
          return true;
        }

        return false;
      };

      const hasSessionNow = await tryGetSession();

      if (hasSessionNow) return;

      setTimeout(async () => {
        const hasSessionLater = await tryGetSession();

        if (!hasSessionLater) {
          setMessage(
            "GitHub sign-in returned without a session. Please try again from the main page."
          );
        }
      }, 1200);
    }

    handleCallback();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
        color: "#ffcb05",
        fontFamily: "Arial, sans-serif",
        fontWeight: 800,
        padding: "24px",
        textAlign: "center",
      }}
    >
      {message}
    </main>
  );
}