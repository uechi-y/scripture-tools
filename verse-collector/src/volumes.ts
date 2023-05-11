// this file exports mnemonics used in URLs of the church website.

export type Volume = {
    name: string;
    books: string[];
};

// https://www.churchofjesuschrist.org/study/scriptures/bofm/<name>/<chapter>?lang=<lang>
export const BOOK_OF_MORMON: Volume = {
    name: "bofm",
    books: [
        "1-ne",
        "2-ne",
        "jacob",
        "enos",
        "omni",
        "w-of-m",
        "mosiah",
        "alma",
        "hel",
        "3-ne",
        "morm",
        "ether",
        "moro",
    ],
};

// https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/<chapter>?lang=<lang>
export const DOCTRINE_AND_COVENANTS: Volume = {
    name: "dc-testament",
    books: ["dc"],
};

// https://www.churchofjesuschrist.org/study/scriptures/pgp/<book>/1?lang=kor
export const PEARL_OF_GREAT_PRICE: Volume = {
    name: "pgp",
    books: ["moses", "abr", "js-m", "js-h", "a-of-f"],
};

// https://www.churchofjesuschrist.org/study/scriptures/nt/<book./<chapter>?lang=<lang>
export const NEW_TESTAMENT: Volume = {
    name: "nt",
    books: [
        "matt",
        "mark",
        "luke",
        "john",
        "acts",
        "rom",
        "1-cor",
        "2-cor",
        "gal",
        "eph",
        "philip",
        "col",
        "1-thes",
        "2-thes",
        "1-tim",
        "2-tim",
        "titus",
        "philem",
        "heb",
        "james",
        "1-pet",
        "2-pet",
        "1-jn",
        "2-jn",
        "3-jn",
        "jude",
        "rev",
    ],
};

// https://www.churchofjesuschrist.org/study/scriptures/ot/<book>/<chapter>?lang=<lang>
export const OLD_TESTAMENT: Volume = {
    name: "ot",
    books: [
        "gen",
        "ex",
        "lev",
        "num",
        "deut",
        "josh",
        "judg",
        "ruth",
        "1-sam",
        "2-sam",
        "1-kgs",
        "2-kgs",
        "1-chr",
        "2-chr",
        "ezra",
        "neh",
        "esth",
        "job",
        "ps",
        "prov",
        "eccl",
        "song",
        "isa",
        "jer",
        "lam",
        "ezek",
        "dan",
        "hosea",
        "joel",
        "amos",
        "obad",
        "jonah",
        "micah",
        "nahum",
        "hab",
        "zeph",
        "hag",
        "zech",
        "mal",
    ],
};
