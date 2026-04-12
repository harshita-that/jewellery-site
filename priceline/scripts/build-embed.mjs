import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["embed/index.js"],
  bundle: true,
  minify: true,
  outfile: "public/priceline.js",
  format: "iife",
  target: ["es2017"],
});

console.log("✅ Embed script built → public/priceline.js");