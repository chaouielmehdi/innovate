import { trigger, state, transition, animate, style } from '@angular/animations';

export const fade = trigger('fade',[
    state('void', style({
        opacity: 0.5,
        top: 15
    })),
    transition('void => *', [
        animate('700ms cubic-bezier(.58, .71, .33, 1)')
    ])
]);