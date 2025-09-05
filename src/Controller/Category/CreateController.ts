import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Category from "../../Model/Category.js";

export default class CategoryCreateController extends AbstractController {
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
        this.response.render("category/form.twig", { category: {}, error: null });
    }

    private async processForm(): Promise<void> {
        try {
            const { nome, descricao } = this.getParams();

            const category = new Category(nome?.trim() || '', descricao?.trim());
            await category.save();

            this.response.redirect('/category');
        } catch (error) {
            this.response.render("category/form.twig", {
                category: this.getParams(),
                error: error instanceof Error ? error.message : 'Erro ao criar categoria'
            });
        }
    }
}
