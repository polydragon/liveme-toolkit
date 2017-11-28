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
                    console.error("Couldn't save favourites!", err); // TODO: Logger
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
                        console.error("Couldn't load favourites!", err); // TODO: Logger
                        this.favourites = new Map<string, number>();
                        return resolve();
                    } else {
                        try {
                            this.favourites = new Map<string, number>(JSON.parse(data));
                            return resolve();
                        } catch (er) {
                            console.error("Malformed JSON in favourites.json", er); // TODO: Logger
                            this.favourites = new Map<string, number>();
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
                    console.error("Couldn't save likes!", err); // TODO: Logger
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
                        console.error("Couldn't load likes!", err); // TODO: Logger
                        this.likes = new Map<string, number>();
                        return resolve();
                    } else {
                        try {
                            this.likes = new Map<string, number>(JSON.parse(data));
                            return resolve();
                        } catch (er) {
                            console.error("Malformed JSON in likes.json", er); // TODO: Logger
                            this.likes = new Map<string, number>();
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
                    console.error("Couldn't save view history!", err); // TODO: Logger
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
                        console.error("Couldn't load view history!", err); // TODO: Logger
                        this.viewed = new Map<string, number>();
                        return resolve();
                    } else {
                        try {
                            this.viewed = new Map<string, number>(JSON.parse(data));
                            return resolve();
                        } catch (er) {
                            console.error("Malformed JSON in viewed.json", er); // TODO: Logger
                            this.viewed = new Map<string, number>();
                            return resolve();
                        }
                    }
                });
        });
    }
}