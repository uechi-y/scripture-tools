use serde::{Deserialize, Serialize};

const PATH_TO_SCRIPTURE_JSON: &'static str = "./lds-scriptures/json/lds-scriptures-json.txt";
const PATH_TO_OUTPUT_DIR: &'static str = "./output";

#[derive(Deserialize, Serialize, Debug, Clone)]
struct Verse {
    volume_title: String,
    book_title: String,
    book_short_title: String,
    chapter_number: u16,
    verse_number: u16,
    verse_title: String,
    verse_short_title: String,
    scripture_text: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct Chapter {
    volume_title: String,
    book_title: String,
    book_short_title: String,
    chapter_number: u16,
    verses: Vec<Verse>,
}

#[derive(Deserialize, Serialize, Debug)]
struct Book {
    volume_title: String,
    book_title: String,
    book_short_title: String,
    chapters: Vec<Chapter>,
}

fn group_by_chapter_number(verses: Vec<Verse>) -> Vec<Chapter> {
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

fn group_by_book_title(chapters: Vec<Chapter>) -> Vec<Book> {
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

fn main() {
    // check if files exists in PATH_TO_SCRIPTURE_JSON
    if !std::path::Path::new(PATH_TO_SCRIPTURE_JSON).exists() {
        panic!("Scripture file not found on {}. If you haven't downloaded submodules, run 'git submodule update --init'", PATH_TO_SCRIPTURE_JSON);
    }

    let verses = {
        let json_string = std::fs::read_to_string(PATH_TO_SCRIPTURE_JSON).unwrap();
        serde_json::from_str::<Vec<Verse>>(&json_string)
            .unwrap()
            .into_iter()
            .map(|verse| {
                if verse.book_title.contains("--") {
                    Verse {
                        book_title: verse.book_title.replace("--", " "),
                        ..verse
                    }
                } else {
                    verse
                }
            })
            .collect()
    };
    let chapters = group_by_chapter_number(verses);
    let books = group_by_book_title(chapters);
    // make a directory to the path of PATH_TO_OUTPUT_DIR
    std::fs::create_dir_all(PATH_TO_OUTPUT_DIR).unwrap();

    for book in books {
        let book_path = format!("{}/{}.json", PATH_TO_OUTPUT_DIR, book.book_title);
        std::fs::write(book_path, serde_json::to_string(&book).unwrap()).unwrap();
    }

    println!("Finished Writing Books Data At {}", PATH_TO_OUTPUT_DIR);
}
