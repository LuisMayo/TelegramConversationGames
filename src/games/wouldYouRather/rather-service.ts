import fetch from 'cross-fetch';
import { GameService } from '../service.interface';
import { Rather } from './rather.bean';
import { convertFromRrrather } from './providers/rrrather/rrrather.interface';
import { Context } from 'telegraf';

// Maybe this should me moved into the rrrather provider but I'll leavce it here since it's the only provider rn
export class RatherGameService implements GameService<Rather> {
    getGameObject(): Promise<Rather | Error> {
        return new Promise((resolve, reject) => {
            fetch('https://www.rrrather.com/botapi').then(data => {
                data.json().then(object => resolve(convertFromRrrather(object))).catch(reject);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static handleCallBack(ctx: Context) {
        
    }
}