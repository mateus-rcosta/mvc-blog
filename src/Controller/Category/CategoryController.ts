import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Category from "../../Model/Category.js";

export default class CategoryController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const { id } = this.getParams();

        if (id) {
            const category = await Category.findById(parseInt(id));
            this.response.render("category/detail.twig", { category });
        } else {
            const categories = await Category.findAll();
            this.response.render("category/list.twig", { categories });
        }
    }
}
