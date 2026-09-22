// middleware — це проміжна функція, яка щось робить із запитом перед 
// тим, як він потрапить у основний код

import multer from "multer"; // дозволяє приймати файли, завантажені через HTML-форму
import path from "node:path";

const storage = multer.diskStorage({
    // куди зберегти
    destination: (req, file, cb) => {
        // process.cwd() повертає поточну робочу папку
        const uploadFile = path.join(process.cwd(), "public", "imgs");
        // null означає, що помилки немає
        cb(null, uploadFile);
    },
    // як назвати
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        // Date.now() повертає поточний час у мілісекундах
        const tempName = `temp_${Date.now()}${ext}`
        cb(null, tempName);
    }
});

export const upload = multer({ storage });