import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import dotenv from "dotenv";
import shortID from "shortid";
import validateToken from "./utils/validate-token";

dotenv.load();
if (!process.env.TOKEN) throw new Error("Missing TOKEN environmental variable.");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: "/var/www/i",
    filename: (req, file, cb) => {
        const extension = file.mimetype.replace(/.+\//, ".");
        const fileName = shortID.generate();

        cb(null, fileName + extension);
    }
});
const handleUpload = multer({ storage });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static("/var/www/i", {
    index: false
}));

app.post("/api/upload", validateToken, handleUpload.single("file"), (req, res) => {
    if (!req.file) return res.json({
        success: false,
        info: "Valid file not received."
    });

    if (req.query.plaintext) return res.send("https://i.sharky.cool/" + req.file.filename);

    res.json({
        success: true,
        info: "https://i.sharky.cool/" + req.file.filename
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

// 404
app.get("*", (req, res) => {
    res.sendFile("/var/www/i/404.png");
});

app.listen(8884);