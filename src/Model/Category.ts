import Database from './Database.js';
import { AbstractModel } from './AbstractModel.js';
import type { Category as PrismaCategory } from '../generated/prisma/client.js';

export default class Category extends AbstractModel {
    public nome: string;
    public descricao?: string;
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor(nome: string = '', descricao?: string) {
        super();
        this.nome = nome;
        this.descricao = descricao || '';
    }

    public async load(id: number): Promise<Category | null> {
        const category = await Database.prisma.category.findUnique({
            where: { id }
        });

        if (!category) return null;

        this.id = category.id;
        this.nome = category.nome;
        this.descricao = category.descricao || '';
        this.createdAt = category.createdAt;
        this.updatedAt = category.updatedAt;

        return this;
    }

    public async save(): Promise<Category> {
        if (this.id) {
            const updated = await Database.prisma.category.update({
                where: { id: this.id },
                data: { nome: this.nome, descricao: this.descricao || '' }
            });
            return Category.fromPrisma(updated);
        } else {
            const created = await Database.prisma.category.create({
                data: { nome: this.nome, descricao: this.descricao || '' }
            });
            return Category.fromPrisma(created);
        }
    }

    public async delete(): Promise<boolean> {
        if (!this.id) return false;

        try {
            await Database.prisma.category.delete({ where: { id: this.id } });
            return true;
        } catch {
            return false;
        }
    }

    public static async findAll(): Promise<Category[]> {
        const categories = await Database.prisma.category.findMany();
        return categories.map(Category.fromPrisma);
    }

    public static async findById(id: number): Promise<Category | null> {
        const category = await Database.prisma.category.findUnique({ where: { id } });
        return category ? Category.fromPrisma(category) : null;
    }

    private static fromPrisma(prismaCategory: PrismaCategory): Category {
        const category = new Category(prismaCategory.nome, prismaCategory.descricao || '');
        category.id = prismaCategory.id;
        category.createdAt = prismaCategory.createdAt;
        category.updatedAt = prismaCategory.updatedAt;
        return category;
    }
}
