import * as fs from "node:fs/promises"; // підключення модуля файлової системи
import { stdout as output, stdin as input } from "node:process"; // ввід-вивід
import * as readline from "node:readline/promises"; // модуль для зручного читання построково
async function getContent() {
    const rl = readline.createInterface({ input, output });
    try {
        const message = await rl.question("Enter your content: ");
        return message;
    }
    catch (error) {
        console.log(`NO DATA ${error}`);
        return "";
    }
    finally {
        rl.close();
    }
}
async function writeToFile(filePath, content) {
    try {
        await fs.appendFile(filePath, content + '\n', 'utf-8'); // додає текст в кінець файлу
        // await fs.writeFile(filePath, content+'\n', 'utf-8')
        input.write("Файл успішно збережено");
    }
    catch (error) {
        console.error("Файл не збережено");
    }
}
