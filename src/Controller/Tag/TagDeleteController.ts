import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Tag from "../../Model/Tag.js";

export default class TagDeleteController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const { id } = this.getParams();
        const tag = new Tag();
        tag['id'] = parseInt(id, 10);
        await tag.delete(); 
        return this.response.redirect("/tag");
    }
}
