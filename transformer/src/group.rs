use crate::types::{Verse, Chapter, Book};

pub fn group_by_chapter_number(verses: Vec<Verse>) -> Vec<Chapter> {
    let mut chapters = vec![];
    let mut current_verses = vec![];

    // this is how we distinguish between chapters.
    // if all books had more than 1 chapter,
    // it would suffice to just use the chapter number
    // but that's not the case, so we need the book title as well.
    let mut current_id = (verses[0].book_short_title.clone(), verses[0].chapter_number);

    for verse in verses {
        if &current_id.0 == &verse.book_short_title && current_id.1 == verse.chapter_number {
            current_verses.push(verse);
        } else {
            current_id = (verse.book_short_title.clone(), verse.chapter_number);

            let first_verse = &current_verses[0];
            let volume_title = first_verse.volume_title.clone();
            let book_title = first_verse.book_title.clone();
            let book_short_title = first_verse.book_short_title.clone();
            let chapter_number = first_verse.chapter_number;

            chapters.push(Chapter {
                volume_title,
                book_title,
                book_short_title,
                chapter_number,
                verses: current_verses,
            });
            current_verses = vec![verse];
        }
    }

    let first_verse = &current_verses[0];
    let volume_title = first_verse.volume_title.clone();
    let book_title = first_verse.book_title.clone();
    let book_short_title = first_verse.book_short_title.clone();
    let chapter_number = first_verse.chapter_number;

    chapters.push(Chapter {
        volume_title,
        book_title,
        book_short_title,
        chapter_number,
        verses: current_verses,
    });

    chapters
}

pub fn group_by_book_title(chapters: Vec<Chapter>) -> Vec<Book> {
    let mut books = vec![];
    let mut current_books = vec![];
    let mut current_book_title = chapters[0].book_short_title.clone();

    for chapter in chapters {
        if current_book_title == chapter.book_short_title {
            current_books.push(chapter);
        } else {
            current_book_title = chapter.book_short_title.clone();

            let first_chapter = &current_books[0];
            let volume_title = first_chapter.volume_title.clone();
            let book_title = first_chapter.book_title.clone();
            let book_short_title = first_chapter.book_short_title.clone();

            books.push(Book {
                volume_title,
                book_title,
                book_short_title,
                chapters: current_books,
            });
            current_books = vec![chapter];
        }
    }

    let first_chapter = &current_books[0];
    let volume_title = first_chapter.volume_title.clone();
    let book_title = first_chapter.book_title.clone();
    let book_short_title = first_chapter.book_short_title.clone();

    books.push(Book {
        volume_title,
        book_title,
        book_short_title,
        chapters: current_books,
    });
    books
}
