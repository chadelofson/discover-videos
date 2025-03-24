import Image from "next/image";
import { CardClassMap, CardPropType } from "@/types";
import styles from "./card.module.css"
import { useState } from "react";
import { motion } from "framer-motion"
import cls from "classnames"

const Card = (props: CardPropType) => {
    const { 
        imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80", 
        size = "medium",
        id,
        shouldScale = true
     } = props;

    const [imgSrc, setImgSrc] = useState(imgUrl)

    const classMap: CardClassMap = {
        large: styles.lgItem,
        medium: styles.mdItem,
        small: styles.smItem
    }

    const handleOnError = () => {
        setImgSrc('/static/clifford.webp')
    }

    const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 }

    const shouldHover = shouldScale && {
        whileHover: { ...scale }
    }

    return (
        <div className={styles.container}>
            <motion.div 
                {...shouldHover}
                className={cls(styles.imgMotionWrapper, classMap[size])}>
                <Image 
                    src={imgSrc} 
                    alt="Picture of the author" 
                    className={styles.cardImg}
                    fill={true}
                    onError={handleOnError}
                />    
            </motion.div>
            
        </div>
    )
}

export default Card