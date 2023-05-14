import * as fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import * as path from "path";
import yargs from "yargs/yargs";

import collect from "./collect";
import { BOOK_OF_MORMON, DOCTRINE_AND_COVENANTS, NEW_TESTAMENT, OLD_TESTAMENT, PEARL_OF_GREAT_PRICE, VolumeDescription } from "./volumes";
import VERSE_COUNT from "./data/verse-count";
import { Book, Chapter, Volume, CollectOptions } from "types";
import { BOOK_ABBREV_TO_FULL, VOLUME_ABBREV_TO_FULL } from "./mapping";
import { AVAILABLE_LANGUAGES } from "lang";

const OUTPUT_DIR =
    process.env.NODE_ENV === "development" ? "../output" : "./output";

async function collectChapter(
    volume: string,
    book: string,
    chapter: number,
    opts: CollectOptions
): Promise<Chapter> {
    const fullVolumeName = VOLUME_ABBREV_TO_FULL[volume];
    const fullBookName = BOOK_ABBREV_TO_FULL[book];

    const rawVerses = await collect(volume, book, chapter, opts.lang);

    const verses = rawVerses.map((verse, vindex) => ({
        volume_title: fullVolumeName,
        volume_title_short: volume,
        book_title: fullBookName,
        book_title_short: book,
        chapter_number: chapter,
        verse_number: vindex + 1,
        scripture_text: verse,
    }));

    return {
        volume_title: fullVolumeName,
        volume_title_short: volume,
        book_title: fullBookName,
        book_title_short: book,
        chapter_number: chapter,
        verses,
    } as Chapter;
}

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
                return await collectChapter(volume, book, chapter, opts);
            })
    );

    return {
        volume_title: fullVolumeName,
        volume_title_short: volume,
        book_title: fullBookName,
        book_title_short: book,
        chapters,
    };
}

async function collectVolume(
    volume: VolumeDescription,
    opts: CollectOptions
): Promise<Volume> {
    const { name, books: bookNames } = volume;

    const books = [];
    for (const book of bookNames) {
        const b = await collectBook(name, book, opts);
        books.push(b);
    }

    return {
        name,
        books,
    };
}

function getOutputDir(dir?: string) {
    if (dir === undefined) return path.resolve(__dirname, OUTPUT_DIR);

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
            describe:
                "Path to output scripture files. Default: ./output/<lang>",
            type: "string",
        })
        .parseSync();

    const odir = path.resolve(getOutputDir(outputDir), lang);

    if (!existsSync(odir)) mkdirSync(odir, { recursive: true });

    for (const desc of [BOOK_OF_MORMON, DOCTRINE_AND_COVENANTS, PEARL_OF_GREAT_PRICE, NEW_TESTAMENT, OLD_TESTAMENT]) {
        console.log(`Starting ${desc.name}`);
        const volume = await collectVolume(desc, { lang });
        await Promise.all(volume.books.map(async (book) => {
            const stringified = JSON.stringify(book);
            const filepath = path.resolve(odir, book.book_title) + ".json";
            await fs.writeFile(filepath, stringified);
        }));
    }

    console.log(`Finished writing books to ${odir}`);
}

main();
