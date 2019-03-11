const fs = require("fs");
const path = require("path");

const viewsPath = path.resolve(__dirname + "../src/views");
const outputPath = path.resolve(__dirname + "../dist/views");

const viewsDir = fs.readdirSync(viewsPath);

viewsDir.forEach(file => {
    fs.copyFileSync(viewsPath + "/" + file, outputPath + "/" + file);
});