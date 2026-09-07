import path from "node:path"  // модуль для роботи зі шляхами
import {getContent, writeToFile} from "./funcs.js"
const FILE_TO_PATH = path.join('logs', 'logs.txt');


const content = await getContent();
await writeToFile(FILE_TO_PATH, content);
