// src/Model/Post.ts
import type {
  Post as PrismaPost,
  User as PrismaUser,
  Category as PrismaCategory,
  Tag as PrismaTag,
  Author as PrismaAuthor,
  PostTag as PrismaPostTag
} from '../generated/prisma/client.js';
import { AbstractModel } from './AbstractModel.js';
import Database from './Database.js';
import Tag from './Tag.js';

export default class Post extends AbstractModel {
  public titulo: string;
  public conteudo: string;
  public slug: string;
  public published: boolean;
  public userId: number;
  public authorId: number;
  public categoryId: number;
  public createdAt: Date;
  public updatedAt: Date;

  // relacionamentos
  public user!: PrismaUser;
  public author!: PrismaAuthor;
  public category!: PrismaCategory;
  public tags: Tag[] = [];

  constructor(
    titulo: string = '',
    conteudo: string = '',
    userId: number = 0,
    published: boolean = false,
    authorId: number = 0,
    categoryId: number = 1,
    slug: string = ''
  ) {
    super();
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.userId = userId;
    this.published = published;
    this.slug = slug;
    this.authorId = authorId;
    this.categoryId = categoryId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.tags = [];
  }

  public async load(id: number): Promise<Post | null> {
    const post = await Database.prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        author: true,
        category: true,
        tags: { include: { tag: true } }
      }
    });

    return post ? Post.fromPrisma(post) : null;
  }

  public async save(): Promise<Post> {
    if (!this.slug) {
      this.slug = `${this.titulo}-${Date.now()}`;
    }

    const tagIds = this.tags.map(t => t.getId()).filter(Boolean);

    const data: any = {
      titulo: this.titulo,
      conteudo: this.conteudo || '',
      slug: this.slug,
      published: this.published,
      userId: this.userId,
      authorId: this.authorId,
      categoryId: this.categoryId,
      tags: tagIds.length
        ? { set: tagIds.map(id => ({ tagId: id })) } 
        : undefined
    };

    const post = this.id
      ? await Database.prisma.post.update({
          where: { id: this.id },
          data,
          include: { user: true, author: true, category: true, tags: { include: { tag: true } } }
        })
      : await Database.prisma.post.create({
          data,
          include: { user: true, author: true, category: true, tags: { include: { tag: true } } }
        });

    return Post.fromPrisma(post);
  }

  public async delete(): Promise<boolean> {
    if (!this.id) return false;

    try {
      await Database.prisma.post.delete({ where: { id: this.id } });
      return true;
    } catch {
      return false;
    }
  }

  public static async create(
    titulo: string,
    conteudo: string,
    userId: number,
    authorId: number,
    categoryId: number,
    tags: Tag[] = []
  ): Promise<Post> {
    const post = new Post(titulo, conteudo, userId, false, authorId, categoryId);
    post.tags = tags;
    return post.save();
  }

  public static async findAll(): Promise<Post[]> {
    const posts = await Database.prisma.post.findMany({
      include: { user: true, author: true, category: true, tags: { include: { tag: true } } }
    });

    return posts.map(Post.fromPrisma);
  }

  public static async findById(id: number): Promise<Post | null> {
    const post = await Database.prisma.post.findUnique({
      where: { id },
      include: { user: true, author: true, category: true, tags: { include: { tag: true } } }
    });

    return post ? Post.fromPrisma(post) : null;
  }

  public static fromPrisma(
    prismaPost: PrismaPost & {
      user: PrismaUser;
      author: PrismaAuthor;
      category: PrismaCategory;
      tags?: (PrismaPostTag & { tag: PrismaTag })[];
    }
  ): Post {
    const post = new Post(
      prismaPost.titulo,
      prismaPost.conteudo || '',
      prismaPost.userId,
      prismaPost.published,
      prismaPost.authorId,
      prismaPost.categoryId,
      prismaPost.slug || ''
    );

    post.id = prismaPost.id;
    post.createdAt = prismaPost.createdAt;
    post.updatedAt = prismaPost.updatedAt;
    post.user = prismaPost.user;
    post.author = prismaPost.author;
    post.category = prismaPost.category;
    post.tags = prismaPost.tags?.map(t => Tag.fromPrisma(t.tag)) || [];

    return post;
  }
}
