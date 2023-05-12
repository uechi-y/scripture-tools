use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Verse {
    pub volume_title: String,
    pub book_title: String,
    pub book_short_title: String,
    pub chapter_number: u16,
    pub verse_number: u16,
    pub verse_title: String,
    pub verse_short_title: String,
    pub scripture_text: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Chapter {
    pub volume_title: String,
    pub book_title: String,
    pub book_short_title: String,
    pub chapter_number: u16,
    pub verses: Vec<Verse>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Book {
    pub volume_title: String,
    pub book_title: String,
    pub book_short_title: String,
    pub chapters: Vec<Chapter>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct BookWithVerseCount {
    pub title: String,
    pub verses: Vec<u16>,
}
