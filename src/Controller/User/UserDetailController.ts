import { type Request, type Response } from "express";
import User from "../../Model/User.js";

export default class UserDetailController {
    constructor(private req: Request, private res: Response) {}

    public async execute() {
        const id = Number(this.req.params.id);
        const user = await User.findById(id);

        if (!user) {
            return this.res.status(404).send("Usuário não encontrado");
        }

        return this.res.render("user/detail.twig", { user });
    }
}