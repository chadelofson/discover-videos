import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal';
import clsx from "classnames"
import styles from "./video.module.css"
import { GetStaticPaths } from 'next';
import { getYoutubeVideoById } from '@/lib/videos';
import Navbar from '@/components/nav/navbar';
import Like from '@/components/icons/like-icon';
import DisLike from '@/components/icons/dislike-icon';


export const getStaticProps = async (context) => {
  const { videoId } = context.params;
  const videoArray = await getYoutubeVideoById(videoId)

  return {
    props: { video: videoArray.length > 0 ? videoArray[0] : {}  },
    // Next.js will invalidate the cache when a
    // request comes in, at most once every 60 seconds.
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"]
    const paths = listOfVideos.map((videoId: string) => ({
      params: { videoId },
    }))
   
    // We'll prerender only these paths at build time.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: "blocking" }
  }
   
  

export default function Video(props) {
  const router = useRouter()
  const { videoId } = router.query

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  useEffect(() => {
    async function getStats() {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await response.json()
      
      
      if (data.length > 0) {
        const favourited = data[0].favourited
        if (favourited === 1) {
          setToggleLike(true)
        } else if (favourited === 0) {
          setToggleDislike(true)
        }
      }
    }
    getStats()
  }, [])

  const runRatingService = async (favourited: number) => {
    return await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        favourited,
      })
    })
  }

  const handleToggleLike = async (e: Event) => {
    const val = !toggleLike
    setToggleLike(val)
    setToggleDislike(toggleLike)
    const favourited = val ? 1 : 0
    await runRatingService(favourited)
  }

  const handleToggleDislike = async (e: Event) => {
    
    const val = !toggleDislike
    setToggleDislike(val)
    setToggleLike(toggleDislike)
    const favourited = val ? 0 : 1
    await runRatingService(favourited)
  }

  

  const { video: { title, publishTime, description, channelTitle, viewCount } } = props

  return (
    <div className={styles.container}>
      <Navbar />
      <ReactModal
        isOpen={true}
        contentLabel="Watch the Video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
            <iframe 
              id="player"
              className={styles.videoPlayer}
              type="text/html"
              width="100%"
              height="390"
              src={`http://www.youtube.com/embed/${videoId}?autoplay=0&enablejsapi=1&origin=http://example.com&controls=0&rel=1`}
              frameborder="0"></iframe>

              <div className={styles.likeDislikeBtnWrapper}>
                <div className={styles.likeBtnWrapper}>
                  <button onClick={handleToggleLike}>
                    <div className={styles.btnWrapper}>
                      <Like selected={toggleLike} />
                    </div>
                  </button>
                </div>
                <button onClick={handleToggleDislike}>
                  <div className={styles.btnWrapper}>
                    <DisLike selected={toggleDislike} />
                  </div>
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalBodyContent}>
                    <div className={styles.col1}>
                        <p className={styles.publishTime}>{publishTime}</p>
                        <p className={styles.title}>{title}</p>
                        <p className={styles.description}>{description}</p>
                    </div>
                    <div className={styles.col2}>
                      <p className={clsx(
                        styles.subText,
                        styles.subTextWrapper
                      )}>
                        <span className={styles.textColor}>Cast: </span>
                        <span className={styles.channelTitle}>{channelTitle}</span>
                      </p>
                    
                    
                      <p className={clsx(
                        styles.subText,
                        styles.subTextWrapper
                      )}>
                        <span className={styles.textColor}>View Count: </span>
                        <span className={styles.channelTitle}>{viewCount}</span>
                      </p>
                      </div>
                </div>

              </div>
        </ReactModal>
    </div>
  )
}
