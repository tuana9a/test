import express from "express";
import fs from "fs";
import path from "path";
import { Video } from "./data/video";

var html = "";
const db = new Map<string, Video>();
const CONFIG = JSON.parse(fs.readFileSync("resource/config.json", "utf-8"));
const rootDir = CONFIG.videos_dir || ".";

async function main() {
    // scane video files
    let count = 0;
    let queue = [rootDir];
    while (queue.length != 0) {
        let entryPath = queue.shift();
        let detail = fs.statSync(entryPath);
        if (detail.isDirectory()) {
            let subFolders = fs.readdirSync(entryPath, "utf-8");
            queue.push(...subFolders.map((e) => entryPath + "/" + e));
        } else if (detail.isFile()) {
            let entity = new Video();
            // entity.id = crypto.createHmac('SHA256', String(count)).update('tuana9a').digest('hex');
            entity.id = String(count);
            entity.name = path.basename(entryPath);
            entity.href = `/video/${entity.id}`;
            entity.path = entryPath;
            entity.year = "";
            db.set(entity.id, entity);
            count++;
        }
    }
    // create index.html
    db.forEach(function (video) {
        html += `<a style="font-size: 20px; text-decoration: none; color: green;" href="${video.href}">${video.name}</a><br>`;
    });
    html = `<html><head><title>Tuana9a's TV</title></head><body style="background: black;">${html}</body><html>`;
    const server = express();
    server.get("/", async function (req, resp) {
        resp.send(html);
    });
    server.get("/video/:id", async function (req, resp) {
        const video = db.get(String(req.params.id));
        const videoPath = video.path;
        const videoStat = fs.statSync(videoPath);
        const fileSize = videoStat.size;
        const requestRange = req.headers.range;
        if (requestRange) {
            // return partial file
            const range = requestRange.replace(/bytes=/, "").split("-");
            const start = parseInt(range[0], 10);
            const end = range[1] ? parseInt(range[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;
            const videoRadStream = fs.createReadStream(videoPath, { start, end });
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunkSize,
                "Content-Type": "video/mp4",
            };
            resp.writeHead(206, headers);
            videoRadStream.pipe(resp);
            return;
        }
        // return full file
        const headers = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        };
        resp.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(resp);
    });

    const port = CONFIG.port;
    console.log(`http://127.0.0.1:${port}`);
    server.listen(port);
}

main();
