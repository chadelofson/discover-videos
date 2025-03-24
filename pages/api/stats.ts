import { NextApiRequest, NextApiResponse } from "next";
import { findVideoIdByUser, insertStats, updateStats } from "@/db/hasura";
import { verifyToken } from "@/lib/utils";

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
    try {
        
        const token = req.cookies.token
        if (!token) {
            res.status(403).json({})
        } else {
            const inputParams = req.method === "POST" ? req.body : req.query
            const { videoId } = inputParams
            if (videoId) {
                const userId = await verifyToken(token)
                const findVideo = await findVideoIdByUser(userId, videoId, token)
                console.log({ findVideo })
                const doesStatsExist = findVideo.length > 0

                if (req.method === "POST") {
                    const { favourited, watched = true} = req.body
                    if (doesStatsExist) {
                        const response = await updateStats(token, {
                            favourited,
                            userId,
                            watched,
                            videoId,
                        })
                        res.json({ msg: "it works!", updateStats: response })
                    } else {
                    
                        const response = await insertStats(token, {
                            favourited,
                            userId,
                            watched,
                            videoId,
                        })
                        res.json({ msg: "it works!", insertStats: response })
                    }
                } else {
                    if (doesStatsExist) {
                        res.json(findVideo)
                    } else {
                        res.status(404).json({ user: null, msg: "Video not found"})
                    }
                }
            }
            
            
        }
       
    } catch (error) {
        console.error("Error occurred /stats", error)
        res.status(500).send({ done: false, error: error?.message })
    }
}