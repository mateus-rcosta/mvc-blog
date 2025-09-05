import { type Request, type Response } from "express";
import User from "../../Model/User.js";

export default class UserDeleteController {
    constructor(private req: Request, private res: Response) {}

    public async execute() {
        const id = Number(this.req.params.id);
        const user = await User.findById(id);

        if (!user) {
            return this.res.status(404).send("Usuário não encontrado");
        }

        await user.delete();
        return this.res.redirect("/user");
    }
}