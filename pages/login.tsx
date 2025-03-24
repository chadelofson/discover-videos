import Logo from '@/components/nav/logo'
import Head from 'next/head'
import React from 'react'

import styles from "../styles/Login.module.css"
import { useRouter } from 'next/router'
import { magic } from '@/lib/magic-client'

export default function Login() {
  const [email, setEmail] = React.useState("")
  const [userMsg, setUserMsg] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const router = useRouter()

  

  React.useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false)
    }
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)

    return () => {
      router.events.off("routeChangeComplete", handleComplete)
      router.events.off("routeChangeError", handleComplete)
    }
  }, [router])

  const handleLoginWithEmail = async (e: Event) => {
    e.preventDefault()
    setIsLoading(true)

    if (email) {

      try {
        setIsLoading(true);

        const didToken = await magic.auth.loginWithMagicLink({ email })  
        
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${didToken}`,
              "Content-Type": "application/json"
            }
          })

          const loggedInResponse = await response.json()
          if (loggedInResponse.done) {
            router.push("/")
          } else {
            setIsLoading(false)
            setUserMsg("Something went wrong logging in")
          }
          
        }
      } catch (error) {
        setIsLoading(false)
        console.error(error)
      }
    } else {
      // show user message
      setIsLoading(false)
      setUserMsg("Enter a valid email address");
    }
  }

  const handleOnChangeEmail = (e: Event) => {
    setUserMsg("")
    const email = e.target.value;
    setEmail(email)
    
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
            <Logo />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input 
            type="text"
            placeholder='Email address' 
            className={styles.emailInput} 
            onChange={handleOnChangeEmail}  
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>{isLoading ? "Loading..." : "Sign In"}</button>
        </div>
      </main>
      
    </div>
  )
}
