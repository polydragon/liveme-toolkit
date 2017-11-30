import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Live, User, UserExtended, Replay, ChatMessage, UserSearch, ReplaySearch } from '../models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LiveMeService {
    constructor(
        private http: HttpClient
    ) { }

    private _httpGet(url) {
        return this.http.get(url, { headers: { 'd': '' } });
    }

    public getFans(uid: string, page: string = '1', pageSize: string = '100'): Promise<User[]> {
        return this._httpGet(`http://live.ksmobile.net/follow/getfollowerlistship?access_token=${uid}&page_size=${pageSize}&page=${page}`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return (<User[]>(<any>result).data);
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getFollowing(uid: string, page: string = '1', pageSize: string = '100'): Promise<User[]> {
        return this._httpGet(`http://live.ksmobile.net/follow/getfollowinglistship?access_token=${uid}&page_size=${pageSize}&page_index=${page}`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return (<User[]>(<any>result).data);
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getUser(uid: string): Promise<UserExtended> {
        return this._httpGet(`http://live.ksmobile.net/user/getinfo?userid=${uid}`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    let u = result.data.user;

                    return <UserExtended>{
                        fans_count: u.count_info.follower_count,
                        following_count: u.count_info.following_count,
                        live_count: u.count_info.live_count,
                        replay_count: u.count_info.replay_count,
                        video_count: u.count_info.video_count,
                        countryCode: u.user_info.countryCode,
                        level: u.user_info.level,
                        sex: u.user_info.sex,
                        short_id: u.user_info.short_id,
                        uid: u.user_info.uid,
                        uname: u.user_info.uname,
                        usign: u.user_info.usign,
                        face: u.user_info.face,
                        big_cover: u.user_info.big_cover,
                        cover: u.user_info.cover,
                        big_face: u.user_info.big_face
                    };
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getUserReplays(uid: string, page: string = '1', pageSize: string = '100'): Promise<Replay[]> {
        return this._httpGet(`http://live.ksmobile.net/live/getreplayvideos?userid=${uid}&page_size=${pageSize}&page_index=${page}`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return <Replay[]>result.data.video_info;
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getChatMessages(url: string): Promise<ChatMessage[]> {
        return this.http.get(url, { responseType: 'text' })
            .toPromise()
            .then((result: string) => {
                let lines = result.split('\n');
                let messages: ChatMessage[] = [];

                for (let line of lines) {
                    try {
                        let parsed = JSON.parse(line);

                        if (parsed.objectName == "RC:TxtMsg") {
                            messages.push(parsed);
                        }
                    } catch (e) {
                        // ignore it, the live.me api is shit
                    }
                }

                return messages;
            });
    }

    public getReplay(id: string): Promise<ReplaySearch> {
        return this._httpGet(`http://live.ksmobile.net/live/queryinfo?userid=0&videoid=${id}`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    if (!result.data.video_info.uname) {
                        return null;
                    }

                    let vid: ReplaySearch = result.data.video_info;
                    vid.uname = result.data.user_info.desc;
                    vid.uface = result.data.user_info.icon;
                    vid.userid = result.data.user_info.userid;
                    
                    return vid;
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getUsernames(search: string, pageSize: number = 10, page: number = 1): Promise<UserSearch[]> {
        return this._httpGet(`http://live.ksmobile.net/search/searchkeyword?keyword=${encodeURIComponent(search)}&type=1&pagesize=${pageSize}&page=${page}`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return <UserSearch[]>result.data.data_info;
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getHashtaggedReplays(search: string, pageSize: number = 10, page: number = 1): Promise<ReplaySearch[]> {
        return this._httpGet(`http://live.ksmobile.net/search/searchkeyword?keyword=${encodeURIComponent(search)}&type=2&pagesize=${pageSize}&page=${page}`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return <ReplaySearch[]>result.data.data_info;
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getLiveNew(): Promise<Live[]> {
        return this._httpGet(`https://live.ksmobile.net/live/newmaininfo`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return <Live[]>result.data.video_info;
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getLiveFemale(): Promise<Live[]> {
        return this._httpGet(`https://live.ksmobile.net/live/girls`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return <Live[]>result.data.video_info;
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }

    public getLiveMale(): Promise<Live[]> {
        return this._httpGet(`https://live.ksmobile.net/live/boys`)
            .toPromise()
            .then((result: any) => {
                if (result.status == 200) {
                    return <Live[]>result.data.video_info;
                } else {
                    Promise.reject('api error, ' + (result.error || 'unknown error'));
                }
            });
    }
}
