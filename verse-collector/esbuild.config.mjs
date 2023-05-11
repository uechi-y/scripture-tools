import esbuild from "esbuild";
import process from "process";

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
    entryPoints: ["src/main.ts"],
    outfile: "dist/main.js",
    bundle: true,
    format: "cjs",
    target: "es2018",
    treeShaking: true,
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}
