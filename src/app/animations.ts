import { trigger, state, style, transition, animate } from '@angular/core';

export const downloaderAnim = trigger('downloaderAnim', [
    state('*', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),

    transition('void => *', [
        style({ opacity: 0 }),
        animate('100ms ease-out')
    ]),
    transition('* => void', [
        style({ opacity: 1 }),
        animate('100ms ease-in')
    ])
]);

export const downloaderItemAnim = trigger('downloaderItemAnim', [
    state('in', style({ opacity: '1', transform: 'translateX(0)' })),
    transition('void => *', [
        style({ opacity: '0', transform: 'translateX(-10%)' }),
        animate('100ms 300ms')
    ]),
    transition('* => void', [
        animate('50ms', style({ opacity: '0', transform: 'translateX(10%)' }))
    ])
]);