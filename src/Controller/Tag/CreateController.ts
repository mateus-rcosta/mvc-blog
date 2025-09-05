import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Tag from "../../Model/Tag.js";

export default class TagCreateController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        if (this.getMethod() === 'POST') {
            const { nome, cor } = this.getParams();
            const tag = new Tag(nome, cor);
            await tag.save(); 
            return this.response.redirect("/tag");
        }

        this.response.render("tag/form.twig", { tag: {}, error: null });
    }
}