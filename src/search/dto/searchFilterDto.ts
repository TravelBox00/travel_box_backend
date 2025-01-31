export class searchFilterResDto {
    word: string;
    filter: string;
    
    constructor(word:string, filter: string) {
        this.word = word,
        this.filter = filter
    };
}

