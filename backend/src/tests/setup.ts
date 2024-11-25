import { PrismaClient } from '@prisma/client';

beforeAll(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  // Limpiar mocks después de todos los tests
  jest.clearAllMocks();
});

afterEach(() => {
  // Limpiar mocks después de cada test
  jest.clearAllMocks();
});
