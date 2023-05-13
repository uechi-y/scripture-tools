import { AvailableLanguage } from "lang";

export type Volume = {
    name: string;
    books: Book[];
};

export type Book = {
    volume_title: string;
    book_title: string;
    chapters: Chapter[];
};

export type Chapter = {
    volume_title: string;
    book_title: string;
    chapter_number: number;
    verses: Verse[];
};

export type Verse = {
    volume_title: string;
    book_title: string;
    chapter_number: number;
    verse_number: number;
    scripture_text: string;
};

export type CollectOptions = {
    lang: AvailableLanguage;
}
