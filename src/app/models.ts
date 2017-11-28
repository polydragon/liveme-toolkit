export interface User {
    countryCode: string;
    level: number;
    sex: number;
    short_id: string;
    uid: string;
    uname: string;
    usign: string;
    face: string;
}

export interface UserExtended extends User {
    big_cover: string;
    cover: string;
    big_face: string;
    fans_count: number;
    following_count: number;
    live_count: number;
    replay_count: number;
    video_count: number;
}

export interface Replay {
    chatSystem: number;
    gzip_msgfile: string;
    hlsvideosource: string;
    likenum: number;
    msgfile: string;
    online: number;
    playnumber: number;
    roomstate: number;
    sharenum: number;
    status: number;
    title: string;
    topic: string;
    topicid: number;
    vdoid: string;
    vid: string;
    videolength: number;
    videosize: number;
    videosource: string;
    vtime: string;
    watchnumber: number;
}

export interface ChatMessage {
    
}