import { verifyToken } from "@/lib/utils"

const redirectUser = async (context) => {
    const token = context.req ? context.req.cookies.token : null
    const userId = await verifyToken(token)
    
    return {
        token,
        userId
    }
}

export default redirectUser