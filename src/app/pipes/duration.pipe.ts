import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        let date = new Date(null);
        date.setSeconds(value);
        let final = date.toISOString().substr(11, 8);

        if (final.startsWith('00:')) {
            final = final.replace('00:', '');
        }

        if (final.startsWith('00:')) {
            final = final.replace('00:', '');
        }

        return final;
    }
}
