import { Router, Request, Response } from "express";

export const authRouter = Router();

authRouter.get("/login", (req: Request, res: Response) => {
    if (res.locals.username && res.locals.username !== 'guest') {
        return res.redirect('/books');
    }
    res.render("pages/login", {
        title: "Login | BRAT LIBRARY"
    });
})
authRouter.post("/login", (req: Request, res: Response) => {
    const {username} = req.body;
    if (username && username.trim() !== '') {
        res.cookie("username", username.trim(), {
            httpOnly: true,
            maxAge: 2 * 60 * 1000
        })
        return res.redirect('/books');
    }
    res.render("pages/login", {
        error: "Please, enter your username!"
    })
})

authRouter.get('/logout', (req: Request, res:Response) => {
    if (req.cookies.username && req.cookies.username) {
        res.clearCookie("username");
    }
    res.render("pages/logout", {
        title: "Logout | BRAT LIBRARY"
    })
})