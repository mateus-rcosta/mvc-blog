import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import User from "../../Model/User.js";

export default class UserController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const users = await User.findAll();
        this.response.render(
            "user/list.twig",
            { users: users ?? [] }
        );
    }
}
