// // * as readline - аліас
// import * as fs from "node:fs/promises" // підключення модуля файлової системи
// import path from "node:path"  // модуль для роботи зі шляхами
// import process from "node:process"
// import {stdout as output, stdin as input} from "node:process" // ввід-вивід
// import * as readline from "node:readline/promises" // модуль для зручного читання построково
// // async означає асинхронну роботу та дозволяє використовувати await
// // await означає, що треба дочекатися, поки Promise завершиться і тільки після цього можна продовжити виконання async функції
// export async function getContent():Promise<string> {
//     const rl = readline.createInterface({input, output});
//     try {
//         const message:string = await rl.question("Enter your content: ");
//         return message;
//     } 
//     catch(error) {
//         console.log(`NO DATA ${error}`);
//         return "";
//     }
//     finally{
//         rl.close();
//     }
// }
// export async function writeToFile(filePath:string, content:string):Promise<void>{
//     try{
//         await fs.appendFile(filePath, content+'\n', 'utf-8') // додає текст в кінець файлу
//         // await fs.writeFile(filePath, content+'\n', 'utf-8')
//         input.write("Файл успішно збережено")
//     }
//     catch(error){
//         console.error("Файл не збережено")
//     }
// }
import * as fs from "node:fs/promises";
import * as readline from "node:readline/promises";
import { stdout as output, stdin as input } from "node:process";
export default class FileWorker {
    static path_to_file;
    static set path(path) {
        FileWorker.path_to_file = path;
    }
    static async getContent() {
        const rl = readline.createInterface({ input, output });
        try {
            const content = await rl.question("Enter your content: ");
            return content;
        }
        catch (error) {
            console.log(`no data ${error}`);
            return '';
        }
        finally {
            rl.close();
        }
    }
    static async writeToFile(filePath, content) {
        try {
            await fs.appendFile(filePath, content + '\n', 'utf-8');
            //await fs.writeFile(filePath, content+'\n', 'utf-8')
            console.log("Файл успішно збережено");
        }
        catch (error) {
            console.log("Файл не збережено");
        }
    }
    static async readFile(filePath) {
        try {
            return await fs.readFile(filePath);
            // const data:string = await fs.readFile(filePath, 'utf-8');
            // console.log(data);
        }
        catch (error) {
            console.error(`ERROR: ${error}`);
        }
    }
}
