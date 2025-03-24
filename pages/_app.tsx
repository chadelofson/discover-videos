import Loading from "@/components/loading/loading";
import { magic } from "@/lib/magic-client";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    
    const checkLogin = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      
    }
    checkLogin()
  }, [])
  
  return isLoading ? <Loading /> : <Component {...pageProps} />;
}
