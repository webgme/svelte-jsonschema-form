import fs from "fs";
import pkg from "../package.json" assert { type: 'json' };;

const version = JSON.stringify(pkg.version);
const versFile = "dist/version.js";

fs.readFile(versFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(/(?<!\w)__SVELTE_JSONSCHEMA_FORM_VERSION__(?!\w)/g, version);

  fs.writeFile(versFile, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});