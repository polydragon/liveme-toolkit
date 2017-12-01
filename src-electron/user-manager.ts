import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';

export class UserManager {
    favourites: Map<string, {}> = new Map<string, {}>();
    likes: Map<string, {}> = new Map<string, {}>();
    viewed: Map<string, number> = new Map<string, number>();

    async load() {
        await this.loadFavourites();
        await this.loadLikes();
        await this.loadViewed();
    }

    // Favourites

    getFavourites() {
        return Array.from(this.favourites);
    }

    addFavourite(uid, face, uname, sex) {
        this.favourites.set(uid, { face: face, uname: uname, sex: sex });
        this.saveFavourites();
    }
    
    removeFavourite(uid) {
        this.favourites.delete(uid);
        this.saveFavourites();
    }
    
    saveFavourites() {
        fs.writeFile(
            path.join(app.getPath('userData'), 'favourites.json'),
            JSON.stringify(Array.from(this.favourites)),
            (err) => {
                if (err) {
                    (<any>global).Log.error(`Couldn't save favourites.json, error: ${err.message}`);                    
                }
            });
    }
    
    loadFavourites(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(app.getPath('userData'), 'favourites.json'),
                'utf8',
                (err, data) => {
                    if (err) {
                        (<any>global).Log.error(`Couldn't load favourites.json, error: ${err.message}`);
                        this.favourites = new Map<string, {}>();
                        return resolve();
                    } else {
                        try {
                            if (!data || data.length == 0) {
                                this.favourites = new Map<string, {}>();
                            } else {
                                this.favourites = new Map<string, {}>(JSON.parse(data));
                            }
                            return resolve();
                        } catch (er) {
                            (<any>global).Log.error(`Malformed json in favourites.json, error: ${err.message}`);                            
                            this.favourites = new Map<string, {}>();
                            return resolve();
                        }
                    }
                });
        });
    }

    // Likes

    getLikes() {
        return Array.from(this.likes);
    }

    addLike(uid, face, uname, sex) {
        this.likes.set(uid, { face: face, uname: uname, sex: sex })
        this.saveLikes();
    }
    
    removeLike(uid) {
        this.likes.delete(uid);
        this.saveLikes();
    }
    
    saveLikes() {
        fs.writeFile(
            path.join(app.getPath('userData'), 'likes.json'),
            JSON.stringify(Array.from(this.likes)),
            (err) => {
                if (err) {
                    (<any>global).Log.error(`Couldn't save likes.json, error: ${err.message}`);                            
                }
            });
    }
    
    loadLikes(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(app.getPath('userData'), 'likes.json'),
                'utf8',
                (err, data) => {
                    if (err) {
                        (<any>global).Log.error(`Couldn't load likes.json, error: ${err.message}`);                            
                        this.likes = new Map<string, {}>();
                        return resolve();
                    } else {
                        try {
                            if (!data || data.length == 0) {
                                this.likes = new Map<string, {}>();
                            } else {
                                this.likes = new Map<string, {}>(JSON.parse(data));
                            }

                            return resolve();
                        } catch (er) {
                            (<any>global).Log.error(`Malformed json in likes.json, error: ${err.message}`);                            
                            this.likes = new Map<string, {}>();
                            return resolve();
                        }
                    }
                });
        });
    }

    // Viewed

    updateViewed(uid, time) {
        this.viewed.set(uid, time);
        this.saveViewed();
    }
    
    saveViewed() {
        fs.writeFile(
            path.join(app.getPath('userData'), 'viewed.json'),
            JSON.stringify(Array.from(this.viewed)),
            (err) => {
                if (err) {
                    (<any>global).Log.error(`Couldn't save viewed.json, error: ${err.message}`);                            
                }
            });
    }
    
    loadViewed(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(app.getPath('userData'), 'viewed.json'),
                'utf8',
                (err, data) => {
                    if (err) {
                        (<any>global).Log.error(`Couldn't load viewed.json, error: ${err.message}`);                            
                        this.viewed = new Map<string, number>();
                        return resolve();
                    } else {
                        try {
                            if (!data || data.length == 0) {
                                this.viewed = new Map<string, number>();
                            } else {
                                this.viewed = new Map<string, number>(JSON.parse(data));
                            }

                            return resolve();
                        } catch (er) {
                            (<any>global).Log.error(`Malformed json in viewed.json, error: ${err.message}`);                            
                            this.viewed = new Map<string, number>();
                            return resolve();
                        }
                    }
                });
        });
    }
}