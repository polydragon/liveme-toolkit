import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';

export class Settings {
    private _storage: Map<string, any> = new Map<string, any>();

    set(key: string, value: any) {
        this._storage.set(key, value);
    }

    get(key: string): any {
        return this._storage.get(key);
    }

    save() {
        fs.writeFile(
            path.join(app.getPath('userData'), 'settings.json'),
            JSON.stringify(Array.from(this._storage)),
            (err) => {
                if (err) {
                    (<any>global).Log.error(`Couldn't save settings.json, error: ${err.message}`);
                }
            });
    }
    
    load(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(app.getPath('userData'), 'settings.json'),
                'utf8',
                (err, data) => {
                    if (err) {
                        (<any>global).Log.error(`Couldn't load settings.json, error: ${err.message}`);
                        this.setDefaults();
                        return resolve();
                    } else {
                        try {
                            if (!data || data.length == 0) {
                                this._storage = new Map<string, string>();
                            } else {
                                this._storage = new Map<string, string>(JSON.parse(data));
                            }

                            this.checkVersion();
                            return resolve();
                        } catch (er) {
                            (<any>global).Log.error(`Malformed json in settings.json, error: ${err.message}`);
                            this.setDefaults();
                            return resolve();
                        }
                    }
                });
        });
    }

    checkVersion() {
        //if (this.get('version') == 1) {
        //    this.set('version', 2);
        //    (<any>global).Log.info(`Settings have been updated to version 2`);        
        //}
    }

    setDefaults() {
        this.set('version', '2');

        this.set('download.ffmpeg', 'ffmpeg');
        this.set('download.path', path.join(app.getPath('downloads'), 'LiveMe Toolkit'));
        this.set('download.useTemplate', false);
        this.set('download.template', '');
        this.set('download.history', true);
        this.set('download.chat', false);
        this.set('video.chat', false);

        this.save();
    }
}