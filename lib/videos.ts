import { getFavouritedVideos, getWatchedVideos } from "@/db/hasura";
import videoTestData from "../data/videos.json"

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "https://youtube.googleapis.com/youtube/v3"
        

  const response = await fetch(`${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`)
  const data = await response.json()
}

export const getCommonVideos = async (url: string) => {
    try {
        const isDev = process.env.DEVELOPMENT;
        const data = isDev ? videoTestData : await fetchVideos(url)
        if (data?.error) {
            console.error("Youtube API Error", data.error)
            return []
        }

        return data.items.map((item) => {
            
            const id = item.id?.videoId || item.id;
            return {
                title: item.snippet.title,
                imgUrl: item.snippet.thumbnails.high.url,
                id,
            }
        })    
    } catch (error) {
        console.error("Something went wrong with video library", error)
        return []
    }
    
}

export const getCommonVideo = async (url: string) => {
    try {
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

        const BASE_URL = "https://youtube.googleapis.com/youtube/v3"
        

        const response = await fetch(`${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`)
        const data = await response.json()

        if (data?.error) {
            console.error("Youtube API Error", data.error)
            return []
        }

        return data.items.map((item) => {
            
            const id = item.id?.videoId || item.id;
            return {
                title: item.snippet.title,
                description: item.snippet.description,
                channelTitle: item.snippet.channelTitle,
                imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                id,
                publishTime: item.snippet.publishedAt,
                viewCount: item.statistics.viewCount,
            }
        })
    } catch (error) {
        console.error("Something went wrong with video library", error)
        return []
    }
    
}

export const getVideos = (searchQuery: string) => {
    const URL = `search?part=snippet&type=video&q=${searchQuery}`;
    return getCommonVideos(URL)
}

export const getPopularVideos = () => {
    const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US"
    return getCommonVideos(URL)
}

export const getYoutubeVideoById = (videoId: string) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&regionCode=US`
    return getCommonVideo(URL)
}

export const getWatchItAgainVideos = async (userId: string, token: string) => {
    const videos = await getWatchedVideos(userId, token)
    return videos?.map((video) => ({ 
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
    }));
}

export const getMyListVideos = async (userId: string, token: string) => {
    const videos = await getFavouritedVideos(userId, token)
    return videos?.map((video) => ({ 
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
    }));
}