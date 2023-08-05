# Verse Collector

This program aims to collect verses from the web into JSON files.

The motivation of this program is to provide correct and official translations of LDS scriptures, by crawling data from [the official church website](https://www.churchofjesuschrist.org).

## Usage
### Build
To build this project, first install the required dependencies:
```bash
$ yarn
```

Then run the build script:
```bash
$ yarn build
```

### Running the Script
The executable has two options:
* `-l, --lang`: Which translation to download (Required)
* `-o, --output-dir`: Path to output scripture files. Default: `./output/<lang>`

For example, to download the German translation, run the following command:
```bash
$ node main.js --lang deu
```
