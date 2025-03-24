export type Video = {
    title: string;
    imgUrl: string; 
    id: string;
}

export type BannerPropType = {
    title: string;
    subTitle: string;
    imgUrl: string;
}

export type NavbarPropType = {
    username: string;
}

export type CardPropType = {
    imgUrl: string;
    size: string;
    id: number;
}

export type CardClassMap = {
    large: string;
    medium: string;
    small: string;
}

export type SectionCardProp = {
    title: string;
    videos: Array<Video>;
    size: string;
}

export type VideoPropType = {
    videoId: string;
}