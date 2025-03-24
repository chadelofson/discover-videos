import styles from "./navbar.module.css"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "./logo";
import { magic } from "@/lib/magic-client";
import Link from "next/link";


export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)
  
  const [username, setUsername] = useState("")
  const [didToken, setDidToken] = useState("");

  const router = useRouter()

  useEffect(() => {
    async function getUsername() {
      try {
        const { email } = await magic.user.getInfo()
        const didToken = await magic.user.getIdToken()
        if (email) {
          setUsername(email); 
        }
      } catch (error) {
        console.log("Error retrieving email:", error);
      }
    }
    getUsername();
  }, []);

  const handleOnClickHome = (e: Event) => {
    e.preventDefault()
    router.push("/")
  }

  const handleOnClickMyList = (e: Event) => {
    e.preventDefault()
    router.push("/browse/my-list")
  }

  const handleShowDropdown = (e: Event) => {
    e.preventDefault()
    setShowDropdown(prevShowDropdown => !prevShowDropdown)
  }

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${didToken}`,
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();
    } catch (error) {
      console.error('Error logging out', error);
      router.push('/login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src="/static/netflix.svg"
              alt="Netflix logo"
              width="128"
              height="34"
            />
          </div>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              {/** Expand more icon */}
              <Image
                src={'/static/expandmore.svg'}
                alt="Expand dropdown"
                width="24"
                height="24"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}
