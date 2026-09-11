// * as readline - аліас
import * as fs from "node:fs/promises" // дозволяє використовувати асинхронні ф-ції
import * as readline from "node:readline/promises" // для роботи з користувачем через консоль
import {stdout as output, stdin as input } from "node:process"
 
export default class FileWorker
{
    // static означає, що властивість належить класу, а не його окремому об'єкту
    private static path_to_file:string;

    public static set path(path:string) {
        FileWorker.path_to_file = path;
    }

    // async означає асинхронну роботу та дозволяє використовувати await
    // await означає, що треба дочекатися, поки Promise завершиться і тільки після цього можна продовжити виконання async функції
    public static async getContent():Promise<string> {
    const rl = readline.createInterface({input,output}) // інтерфейс для роботи з консоллю
    try {
        // await дозволяє дочекатися введення даних користувачем
        const content:string =  await rl.question("Enter your content: ")
        return content
    } 
    catch(error) {
        console.log(`no data ${error}`)
        return ''
    }
    finally { // finally виконується завжди, незалежно від того, чи була помилка чи ні
        rl.close() // закриття інтерфейсу
    }
}

public static async writeToFile(filePath:string, content:string):Promise<void>{
    try{
        // appendFile додає текст в кінець файлу, якщо файл не існує - створює його
        // writeFile перезаписує файл, якщо файл не існує - створює його
        // utf-8 - кодування тексту, яке дозволяє працювати з кирилицею
        await fs.appendFile(filePath, content+'\n', 'utf-8')
        console.log("Successfully saved to file!")
    }
    catch(error){
        console.log("File not saved :(")
    }
}
 
public static async readFile(filePath:string) {
    try {
        return await fs.readFile(filePath);
    }
    catch(error) {
        console.error(`ERROR: ${error}`);
    }
}
}