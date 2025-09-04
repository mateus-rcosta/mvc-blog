import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Category from "../../Model/Category.js";

export default class CreateController extends AbstractController {
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
        try {
            this.response.render("category/form.twig", {
                category: {},
                error: null
            });
        } catch (error) {
            console.error('Erro ao carregar formulário:', error);
            this.response.status(500).send('Erro ao carregar formulário');
        }
    }

    private async processForm(): Promise<void> {
        try {
            const { nome, descricao } = this.getParams();

            if (!nome || nome.trim().length === 0) {
                throw new Error('O nome da categoria é obrigatório');
            }

            const category = new Category(nome.trim(), descricao?.trim());
            await category.save();

            this.response.redirect('/category');
        } catch (error) {
            console.error('Erro ao criar categoria:', error);

            this.response.render("category/form.twig", {
                category: this.getParams(),
                error: error instanceof Error ? error.message : 'Erro ao criar categoria'
            });
        }
    }
}