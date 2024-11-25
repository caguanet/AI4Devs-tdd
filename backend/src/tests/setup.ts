import { PrismaClient } from '@prisma/client';

beforeAll(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
  jest.clearAllMocks();
});
