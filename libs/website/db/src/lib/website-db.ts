import { PrismaClient } from '@prisma/client';
import { PostSeed, Post } from '@astro-nx-depla/website/entities/post';
import { UserSeed } from '@astro-nx-depla/website/entities/user';

class DB extends PrismaClient {
  static #instance = new DB();
  static instance = () => this.#instance;

  constructor() {
    super();
    this.seed();
    this.post = Post(this.post);
  }

  async seed() {
    UserSeed.call(this);
    PostSeed.call(this);
  }
}

export const db = DB.instance();
