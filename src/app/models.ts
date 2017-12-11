// todo: redo these and make more consistent

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

export interface UserSearch {
    user_id: string;
    nickname: string;
    face: string;
    is_live: number;
    sex: number;
    level: number;
}

export interface ReplaySearch extends Replay {
    uname: string;
    uface: string;
    userid: string;
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
    vtime: number;
    watchnumber: number;
}

export interface ChatMessage {
    
}

export interface Live extends Replay {
    impression: [{
        tag_id: number,
        tag_name: string,
        tag_color: string
        num: number
    }]
}