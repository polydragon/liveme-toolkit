import { Pipe, PipeTransform } from '@angular/core';
import * as formatDuration from 'format-duration';

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return formatDuration(+value);
    }
}
