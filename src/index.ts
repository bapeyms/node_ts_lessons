// import path from "node:path"  // модуль для роботи зі шляхами
// import {getContent, writeToFile} from "./funcs.js"
// const FILE_TO_PATH = path.join('logs', 'logs.txt');


// const content = await getContent();
// await writeToFile(FILE_TO_PATH, content);

import path from "node:path"
import FileWorker from "./funcs.js"
const FILE_TO_PATH = path.join('logs','logs.txt')
 
FileWorker.path = FILE_TO_PATH;
let content:string|undefined = await FileWorker.getContent()
await FileWorker.writeToFile(FILE_TO_PATH, content)
content = (await FileWorker.readFile(FILE_TO_PATH))?.toString('utf-8');
console.log(`Content from file ${content}`);