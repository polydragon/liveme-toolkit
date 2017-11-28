import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'lmt-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
    @Output() onSubmitted: EventEmitter<{}> = new EventEmitter();

    searchTypes: string[] = [
        'Username',
        'User ID',
        'Video ID',
        'Hashtag'
    ];

    searchType: string = 'Username';
    searchTerm: string;

    constructor() { }

    onSubmit() {
        this.onSubmitted.emit({ type: this.searchType, term: this.searchTerm });
    }
}
