// //Успадкування, поліморфізм
// abstract class Transport {
//   private model;
//   constructor(model: string) {
//     this.model = model;
//   }
//   abstract move(): void;
// }
// class Bus extends Transport {
//   constructor(model: string) {
//     super(model);
//   }

//   move(): void {
//     console.log("Bus move");
//   }
// }

// class Car extends Transport {
//   constructor(model: string) {
//     super(model);
//   }

//   move(): void {
//     console.log("Car move");
//   }
// }


// function drive(tr:Transport):void {
//     tr.move()
// }

// drive(new Car("mazda"))
// drive(new Bus("my bus")).
 
// enum Roles {
//   ADMIN=1,
//   MANAGER,
//   USER,
// }

// const role: Roles = Roles.MANAGER;

// console.log(Roles[role]);
//TODO: function
// let a:any = "hello"
// a = 10
// let a2:unknown 

// * as readline - аліас
import * as fs from "node:fs/promises" // підключення модуля файлової системи
import path from "node:path"  // модуль для роботи зі шляхами
import process from "node:process"
import {stdout as output, stdin as input} from "node:process" // ввід-вивід
import * as readline from "node:readline/promises" // модуль для зручного читання построково

const FILE_TO_PATH = path.join('logs', 'logs.txt');
// fs.writeFileSync(FILE_TO_PATH, "Node");
// fs.writeFile(FILE_TO_PATH, "Node", () => {
//     console.log("Success!"); // переписує файл і записує Node
// }) 

// async означає асинхронну роботу та дозволяє використовувати await
// await означає, що треба дочекатися, поки Promise завершиться і тільки після цього можна продовжити виконання async функції

async function getContent():Promise<void> {
    const rl = readline.createInterface({input, output});
    try {
        const message:string = await rl.question("Enter your content: ");
        console.log(`Content: ${message}`);
    } 
    catch(error) {
        console.log("no data");
        rl.close();
    }
    finally{
        rl.close();
    }
}

async function writeToFile(filePath:string, content:string):Promise<void>{
    try{
        await fs.appendFile(filePath, content+'\n', 'utf-8') // додає текст в кінець файлу
        // await fs.writeFile(filePath, content+'\n', 'utf-8')
        input.write("Файл успішно збережено")
    }
    catch(error){
        console.error("Файл не збережено")
    }
}

getContent().then((data:string) => {
    writeToFile(FILE_TO_PATH, data);
})

// stdin.on('data', (data:Buffer) => {
//     console.log("Bytes", data);
//     const content:string = data.toString('utf-8');
//     console.log("Content", content);
//     writeToFile(FILE_TO_PATH, content).then(_=> {

//     })
// })