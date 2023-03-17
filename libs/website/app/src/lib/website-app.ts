import { PrismaClient } from '@prisma/client';
import { PostSeed, Post } from '@astro-nx-depla/website/entities/post';
import { UserSeed } from '@astro-nx-depla/website/entities/user';

class App extends PrismaClient {
  static #instance = new App();
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

export const app = App.instance();
