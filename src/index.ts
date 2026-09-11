import * as fs from "node:fs/promises"
import os from "node:os" 
import path from "node:path"
import FileWorker from "./funcs.js"

// /. означає створення у поточній директорії
const FOLDER_NAME = './logs';

try {
    // mkdir - створює нову директорію, якщо вона не існує
    await fs.mkdir(FOLDER_NAME, {recursive: true});
    console.log(`Folder ${FOLDER_NAME} is created or already exists!`)
}
catch(error) {
    console.log("Error creating folder: ", error);
}

const FILE_TO_PATH = path.join(FOLDER_NAME,'logs.txt')

FileWorker.path = FILE_TO_PATH;

// let content:string|undefined = await FileWorker.getContent()
// await FileWorker.writeToFile(FILE_TO_PATH, content)
// // ?. означає, що якщо об'єкт зліва не є null або undefined, то виконується метод справа. Якщо об'єкт зліва є null або undefined, то метод справа не виконується і повертається undefined
// content = (await FileWorker.readFile(FILE_TO_PATH))?.toString('utf-8');
// console.log(`Content from logs.txt: ${content} \n`);

// 1. readdir() - читає вміст директорії і повертає масив імен файлів та папок у ній
const readDirFile = await fs.readdir('./homeworkFsModule');
console.log(`Content from homeworkFsModule: ${readDirFile} \n`);

// 2. rename() - перейменовує файл або папку
// 3. access() - перевіряє, чи існує файл
try {
    await fs.access('./homeworkFsModule/file1.txt') // перевірка, чи існує файл
    await fs.rename(
    './homeworkFsModule/file1.txt',
    './homeworkFsModule/file1_renamed.txt'
);
console.log("File renamed successfully!");
}
catch(error) {
    console.log("Error renaming file: ", error);
}

// 4. copyFile() - копіює файл
await fs.copyFile(
    './homeworkFsModule/file2.txt',
    './homeworkFsModule/file2_copied.txt'
)

// 5. unlink() - видаляє файл
try {
    await fs.unlink('./homeworkFsModule/file3.txt')
}
catch(error) {
    console.log("Error deleting file: ", error);
}

// 6. stat() - повертає метадані про файл
const stats = await fs.stat('./homeworkFsModule/file2.txt')
console.log(`File size: ${stats.size} bytes`);
console.log(`File created at: ${stats.birthtime}`);
console.log(`File modified at: ${stats.mtime}`);

// 7. utimes() - змінює час доступу та модифікації файлу
const now = new Date();
await fs.utimes('./homeworkFsModule/file2.txt', now, now)

// 8. mkdtemp() - створює тимчасову директорію
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'my-temp-dir-'));
console.log(`Temporary directory created at: ${tempDir}`);

// 9. realpath() - повертає абсолютний шлях до файлу
const realPath = await fs.realpath('./homeworkFsModule/file2.txt');
console.log(`Real path to file2.txt: ${realPath}`);

// 10. rm() - видаляє файл або директорію
await fs.rm('./homeworkFsModule/file2_copied.txt') 
