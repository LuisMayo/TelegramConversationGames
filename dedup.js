const fs = require("fs");
const json = fs.readFileSync("src/games/tod/questions.json", {encoding: 'utf-8'});
let obj = JSON.parse(json);
obj = obj.filter((item, idx, arr) =>{
     const results = arr.findIndex(item2 => item2.summary === item.summary);
     return idx === results;
    });

fs.writeFileSync("src/games/tod/questions.json", JSON.stringify(obj), {encoding: "utf-8"});