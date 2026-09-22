// NextFunction - тип для next()
import {Request, Response, NextFunction} from "express"
import FileWorker from "../funcs.js"
import path from "node:path"
 
export const loggerMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const logPath = path.join(process.cwd(), "logs", "logs.txt");
        // toISOString() перетворює об'єкт дати на рядок у стандартизованому форматі
        let logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}`;

        if (req.params && Object.keys(req.params).length > 0) {
            logMessage += ` | Params: ${JSON.stringify(req.params)}`
        }
        if (req.body && Object.keys(req.body).length > 0) {
            logMessage += ` | Body: ${JSON.stringify(req.body)}`
        }
        await FileWorker.writeToFile(logPath, logMessage);
    }
    catch (error) {
        console.log("Logger Middleware Error: ", error);
    }
    next() // функція, що передає запити наступному middleware або route handler
}