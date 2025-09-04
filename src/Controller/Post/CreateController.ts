import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Post from "../../Model/Post.js";
import User from "../../Model/User.js";
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
            const users = await User.findAll();
            const categories = await Category.findAll();

            this.response.render("post/form.twig", {
                users,
                categories,
                post: {} // post vazio para o form
            });
        } catch (error) {
            console.error('Erro ao carregar formulário:', error);
            this.response.status(500).send('Erro ao carregar formulário');
        }
    }

    private async processForm(): Promise<void> {
        try {
            const { titulo, conteudo, userId, authorId, categoryId, published } = this.getParams();

            if (!titulo || !conteudo || !userId) {
                throw new Error('Todos os campos obrigatórios devem ser preenchidos');
            }

            const post = new Post(
                titulo.trim(),
                conteudo.trim(),
                parseInt(userId, 10),
                published === 'on',
                categoryId ? parseInt(categoryId, 10) : 1
            );

            await post.save();

            this.response.redirect('/post');
        } catch (error) {
            console.error('Erro ao criar post:', error);

            const users = await User.findAll();
            const categories = await Category.findAll();

            this.response.render("post/form.twig", {
                users,
                categories,
                post: this.getParams(),
                error: error instanceof Error ? error.message : 'Erro ao criar post'
            });
        }
    }
}
