use std::collections::HashMap;

use clap::{Parser, ValueEnum};
use scripture_tools::{
    group::{group_by_book_title, group_by_chapter_number},
    mapping::OFFICIAL_ABBREV_MAPPING,
    types::{Book, Verse},
};

const PATH_TO_SCRIPTURE_JSON: &'static str = "./lds-scriptures/json/lds-scriptures-json.txt";
const PATH_TO_OUTPUT_DIR: &'static str = "./output";

#[derive(ValueEnum, Clone, Debug)]
enum OutputType {
    VerseCount,
    AllVerses,
}

#[derive(Parser, Debug)]
struct Args {
    /// specify which artifact you want to see
    #[clap(value_enum, default_value_t=OutputType::AllVerses)]
    output_type: OutputType,
}

fn fetch_verses() -> Vec<Verse> {
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
}

// emit verse count data at verse-count.json
// this file tells you how many verses there are in each chapter
// ex> { "Helaman":[34,14,37,26,52,41,29,28,41,19,38,26,39,31,17,25], ... }
fn emit_verse_count(books: Vec<Book>) {
    let books = books
        .into_iter()
        .map(|book| {
            let verses = book
                .chapters
                .into_iter()
                .map(|chapter| chapter.verses.len() as u16)
                .collect::<Vec<u16>>();
            let title = OFFICIAL_ABBREV_MAPPING
                .get(&book.book_title)
                .unwrap_or_else(|| {
                    panic!(
                        "Book title {} not found in abbreviation mapping",
                        book.book_title
                    )
                });
            (*title, verses)
        })
        .collect::<HashMap<_, _>>();

    let verses_path = format!("{}/verse-count.json", PATH_TO_OUTPUT_DIR);
    std::fs::write(&verses_path, serde_json::to_string(&books).unwrap()).unwrap();

    println!("Finished Writing Verses Data At {}", verses_path);
}

fn emit_all_verses(books: Vec<Book>) {
    for book in books {
        let book_path = format!("{}/{}.json", PATH_TO_OUTPUT_DIR, book.book_title);
        std::fs::write(book_path, serde_json::to_string(&book).unwrap()).unwrap();
    }

    println!("Finished Writing Books Data At {}", PATH_TO_OUTPUT_DIR);
}

fn main() {
    // check if files exists in PATH_TO_SCRIPTURE_JSON
    if !std::path::Path::new(PATH_TO_SCRIPTURE_JSON).exists() {
        panic!("Scripture file not found on {}. If you haven't downloaded submodules, run 'git submodule update --init'", PATH_TO_SCRIPTURE_JSON);
    }

    let verses = fetch_verses();
    let chapters = group_by_chapter_number(verses);
    let books = group_by_book_title(chapters);

    // make a directory to the path of PATH_TO_OUTPUT_DIR
    std::fs::create_dir_all(PATH_TO_OUTPUT_DIR).unwrap();

    let args = Args::parse();
    match args.output_type {
        OutputType::AllVerses => emit_all_verses(books),
        OutputType::VerseCount => emit_verse_count(books),
    }
}
