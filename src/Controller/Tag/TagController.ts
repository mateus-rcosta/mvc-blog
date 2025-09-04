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
            const tag = new Tag(id);
            const loadedTag = await tag.load(parseInt(id));
            this.response.render("tag/single.twig", { tag: loadedTag });
        } else {
            const tags = await Tag.findAll();
            this.response.render("tag/list.twig", { tags });
        }
    }
}