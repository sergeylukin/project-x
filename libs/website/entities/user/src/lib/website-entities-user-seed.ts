export async function UserSeed() {
  const userExist = await this.user.count({
    where: {
      name: 'foo',
    },
  });

  if (!userExist) {
    await this.user.create({
      data: {
        name: 'foo',
        email: 'foo@example.com',
      },
    });
  }
  const author = await this.user.findUnique({
    where: {
      email: 'foo@example.com',
    },
  });
}
