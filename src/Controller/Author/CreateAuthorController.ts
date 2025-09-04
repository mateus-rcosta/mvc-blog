import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Author from "../../Model/Author.js";

export default class CreateAuthorController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        if (this.getMethod() === 'POST') {
            await this.processForm();
            return;
        }
        await this.showForm();
    }

    private async showForm(): Promise<void> {
        this.response.render("author/form.twig", { author: {} });
    }

    private async processForm(): Promise<void> {
        try {
            const { nome, email, bio } = this.getParams();

            if (!nome || !email) {
                throw new Error('Nome e email são obrigatórios');
            }

            const author = new Author(nome.trim(), email.trim(), bio?.trim() || '');
            await author.save();

            this.response.redirect('/authors');
        } catch (error) {
            this.response.render("author/form.twig", {
                author: this.getParams(),
                error: error instanceof Error ? error.message : 'Erro ao criar autor'
            });
        }
    }
}
