import { Injectable } from '@nestjs/common';

@Injectable()

export class AuthService {
    constructor() {}

    async post(
        postWhereUniqueInput: Prisma.PostWhereUniqueInput,
      ): Promise<Post | null> {
        return this.prisma.post.findUnique({
          where: postWhereUniqueInput,
        });
      }
}
