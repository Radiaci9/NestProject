import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

const getHashedPassword = async (password) =>
  await bcrypt.hash(
    password,
    process.env.BCRIPT_SALT_ROUNDS
      ? Number.parseInt(process.env.BCRIPT_SALT_ROUNDS)
      : 5,
  );

async function main() {
  const adminId = uuid();
  const adminProfileId = uuid();
  const adminPost1Id = uuid();
  const adminPost1Comment1Id = uuid();
  const adminPost1Comment2Id = uuid();

  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      email: 'admin@gmail.com',
      password: await getHashedPassword('admin'),
      role: 'ADMIN',
      isActivated: true,
      posts: {
        create: {
          id: adminPost1Id,
          title: 'Post title 1',
          content: 'conteeeeeeeeeeeeeeeent',
          published: true,
          comments: {
            createMany: {
              data: [
                {
                  id: adminPost1Comment1Id,
                  content: 'New Comment 1',
                  authorId: adminId,
                },
                {
                  id: adminPost1Comment2Id,
                  content: 'New Comment 2',
                  authorId: adminId,
                },
              ],
            },
          },
        },
      },
      profile: {
        create: {
          id: adminProfileId,
          firstName: 'admin',
          bio: 'My bio',
        },
      },
    },
  });

  const userId = uuid();
  const userPost1Id = uuid();
  const userPost2Id = uuid();
  const userPost3Id = uuid();

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'user@gmail.com',
      password: await getHashedPassword('user'),
      role: 'USER',
      isActivated: true,
      posts: {
        createMany: {
          data: [
            {
              id: userPost1Id,
              title: 'User post title 1',
              content: 'conteeeeeeeeeeeeeeeent',
              published: true,
            },
            {
              id: userPost2Id,
              title: 'USer post title 2',
              content: 'conteeeeeeeeeeeeeeeent',
              published: true,
            },
            {
              id: userPost3Id,
              title: 'USer post title 3',
              content: 'conteeeeeeeeeeeeeeeent',
              published: false,
            },
          ],
        },
      },
    },
  });

  const emptyuserId = uuid();
  const emptyuserProfileId = uuid();

  const emptyuser = await prisma.user.upsert({
    where: { id: emptyuserId },
    update: {},
    create: {
      id: emptyuserId,
      email: 'emptyuser@gmail.com',
      password: await getHashedPassword('emptyuser'),
      role: 'USER',
      isActivated: true,
      profile: {
        create: {
          id: emptyuserProfileId,
          firstName: 'emptyuser',
          bio: 'Empty user bio ',
        },
      },
    },
  });

  console.log({ admin, user, emptyuser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
