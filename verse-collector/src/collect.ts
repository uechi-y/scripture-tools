import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import * as cheerio from "cheerio";
import { __dirname } from "./lib";

const CACHE_DIRECTORY = ".cache";

function urlToFilename(url: string): string {
    return (
        url
            .replace(/^https?:\/\//, "") // replace http(s) with empty string
            .replace(/\//g, "_") // replace all slashes with underscores
            .replace(/\./g, "-") + ".html" // replace all dots with dashes
    );
}

// fetch html from web (or cache if it exists) and return the html string
async function fetchURL(url: string): Promise<string> {
    const cachePath = resolve(__dirname, CACHE_DIRECTORY);

    // if cache directory exists, create it
    if (!existsSync(cachePath)) mkdirSync(CACHE_DIRECTORY, { recursive: true });

    const htmlCachePath = resolve(
        __dirname,
        CACHE_DIRECTORY,
        urlToFilename(url)
    );

    // return from cache if it exists
    if (existsSync(htmlCachePath))
        return await readFile(htmlCachePath, { encoding: "utf8" });

    const html = await fetch(url).then((res) => res.text());
    if (html)
        await writeFile(htmlCachePath, html, { encoding: "utf8" });

    return html;
}

type CollectOptions = {
    lang: "kor" | "eng";
};

// const defaultOptions = {
//     lang: "eng"
// } satisfies CollectOptions;

export default async function collect(url: string) {
    const html = await fetchURL(url);

    const $ = cheerio.load(html);

    const verseEls = $(".body-block p.verse");

    // remove verse numbers at the beginning
    verseEls.find(".verse-number").remove();

    // remove superscripts on verses
    verseEls.find("sup").remove();

    const verses = verseEls
        .map(function(_, el) {
            return $(el).text().trim();
        })
        .toArray();

    console.log(`Crawled ${verses.length} verses from ${url}`);
}
