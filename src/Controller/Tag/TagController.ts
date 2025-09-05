import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Tag from "../../Model/Tag.js";

export default class TagController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const { id } = this.getParams();

        if (id) {
            const tag = await Tag.findById(parseInt(id, 10));
            this.response.render("tag/detail.twig", { tag });
        } else {
            const tags = await Tag.findAll();
            this.response.render("tag/list.twig", { tags });
        }
    }
}
