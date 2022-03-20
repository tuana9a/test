import fs from "fs";
const data = JSON.parse(fs.readFileSync("temp.json"));
const videoUrls = data;
const videoIds = data.map((x) => x.split("?v=")[1]);
videoUrls.forEach((x) => console.log(x));
videoIds.forEach((x) => console.log(x));
