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

import * as fs from "node:fs" // підключення модуля файлової системи
import path from "node:path"  // модуль для роботи зі шляхами
import process from "node:process"
import {stdout, stdin} from "node:process"

const FILE_TO_PATH = path.join('logs', 'logs.txt');
// fs.writeFileSync(FILE_TO_PATH, "Node");
// fs.writeFile(FILE_TO_PATH, "Node", () => {
//     console.log("Success!");
// })

async function writeToFile(filePath:string, content:string):Promise<void>{
    try{
        await fs.appendFile(filePath, content+'\n', 'utf-8')
        // await fs.writeFile(filePath, content+'\n', 'utf-8')
        stdout.write("Файл успішно збережено")
    }
    catch(error){
        console.log("Файл не збережено")
    }
}

stdin.on('data', (data:Buffer) => {
    console.log("Bytes", data);
    const content:string = data.toString('utf-8');
    console.log("Content", content);
    writeToFile(FILE_TO_PATH, content).then(_=> {
        
    })
})