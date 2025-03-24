import Link from 'next/link'
import Image from "next/image"
import React from 'react'
import styles from "./navbar.module.css"

export default function Logo() {
  return (
    <Link href="" className={styles.logoLink}>
        <div className={styles.logoWrapper}>
        <Image 
            src="/static/netflix.svg" 
            alt="Netflix Logo" 
            width={128}
            height={34}
        />
        </div>
    </Link>
  )
}
