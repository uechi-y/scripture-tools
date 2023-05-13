import * as fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import * as path from "path";
import yargs from "yargs/yargs";

import collect from "./collect";
import { BOOK_OF_MORMON, VolumeDescription } from "./volumes";
import VERSE_COUNT from "./data/verse-count";
import { Book, Chapter, Volume, CollectOptions } from "types";
import { BOOK_ABBREV_TO_FULL, VOLUME_ABBREV_TO_FULL } from "./mapping";
import { AVAILABLE_LANGUAGES } from "lang";

const OUTPUT_DIR = process.env.NODE_ENV === "development" ? "../output" : "./output";

async function collectBook(
    volume: string,
    book: string,
    opts: CollectOptions
): Promise<Book> {
    const chaptersCount = VERSE_COUNT[book].length;
    const fullVolumeName = VOLUME_ABBREV_TO_FULL[volume];
    const fullBookName = BOOK_ABBREV_TO_FULL[book];

    const chapters = await Promise.all(
        Array(chaptersCount)
            .fill(0)
            .map(async (_, index) => {
                const chapter = index + 1;
                const rawVerses = await collect(
                    `https://www.churchofjesuschrist.org/study/scriptures/${volume}/${book}/${chapter}?lang=${opts.lang}`
                );

                const verses = rawVerses.map((verse, vindex) => ({
                    volume_title: fullVolumeName,
                    book_title: fullBookName,
                    chapter_number: chapter,
                    verse_number: vindex + 1,
                    scripture_text: verse,
                }));

                return {
                    volume_title: fullVolumeName,
                    book_title: fullBookName,
                    chapter_number: chapter,
                    verses,
                } as Chapter;
            })
    );

    return {
        volume_title: fullVolumeName,
        book_title: fullBookName,
        chapters,
    };
}

async function collectVolume(
    volume: VolumeDescription,
    opts: CollectOptions
): Promise<Volume> {
    const { name, books: bookNames } = volume;

    const books = await Promise.all(
        bookNames.map((book) => collectBook(name, book, opts))
    );
    return {
        name,
        books,
    };
}

function getOutputDir(dir?: string) {
    if (dir === undefined)
        return path.resolve(__dirname, OUTPUT_DIR);

    return dir;
}

async function main() {
    const { lang, outputDir } = yargs(process.argv.slice(2))
        .option("lang", {
            alias: "l",
            choices: AVAILABLE_LANGUAGES,
            describe: "Which translation to use",
            demandOption: true,
            type: "string",
        })
        .option("output-dir", {
            alias: "o",
            describe: "Path to output scripture files. Default: ./output/<lang>",
            type: "string",
        })
        .parseSync();

    const odir = path.resolve(getOutputDir(outputDir), lang);

    if (!existsSync(odir)) mkdirSync(odir, { recursive: true });

    const volume = await collectVolume(BOOK_OF_MORMON, { lang });
    await Promise.all(
        volume.books.map(async (book) => {
            const stringified = JSON.stringify(book);
            const filepath = path.resolve(odir, book.book_title) + ".json";
            await fs.writeFile(filepath, stringified);
        })
    );

    console.log(`Finished writing books to ${outputDir}`);
}

main();
