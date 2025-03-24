import SectionCards from '@/components/card/section-cards'
import Navbar from '@/components/nav/navbar'
import Head from 'next/head'
import React from 'react'
import styles from "@/styles/Mylist.module.css"
import redirectUser from '@/utils/redirectUser'
import { getMyListVideos } from '@/lib/videos'


export async function getServerSideProps(context) {
  const { token, userId } = await redirectUser(context)
  
  const mylistVideos = await getMyListVideos(userId, token)
  
  return { props: { mylistVideos } }
}

export default function MyList({ mylistVideos }) {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
            <SectionCards
                title="My List"
                videos={mylistVideos}
                size="small"
                shouldWrap
                shouldScale={false} 
            />
        </div>
      </main>
    </div>
  )
}
