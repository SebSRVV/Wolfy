declare module 'sentiment' {
    export interface SentimentResult {
        score: number;
        comparative: number;
        words: string[];
        positive: string[];
        negative: string[];
    }

    export default class Sentiment {
        analyze(text: string): SentimentResult;
    }
}
