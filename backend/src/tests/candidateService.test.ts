import { PrismaClient } from '@prisma/client';
import { addCandidate, setPrismaInstance } from '../application/services/candidateService';

let prisma: PrismaClient;

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: jest.fn()
      },
      $disconnect: jest.fn()
    }))
  };
});

beforeAll(() => {
  prisma = new PrismaClient();
  prisma.candidate.create = jest.fn();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Inserción de Candidatos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPrismaInstance(prisma);
  });

  it('debería guardar un candidato válido en la base de datos', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Falsa 123'
    };

    (prisma.candidate.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      ...candidateData
    });

    // Act
    const result = await addCandidate(candidateData);

    // Assert
    expect(result).toHaveProperty('id');
    expect(result.firstName).toBe('Juan');
    expect(prisma.candidate.create).toHaveBeenCalledWith({
      data: expect.objectContaining(candidateData)
    });
  });

  it('debería lanzar un error si el email ya existe', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };

    const error = new Error('The email already exists in the database');
    (prisma.candidate.create as jest.Mock).mockRejectedValueOnce(error);

    // Act & Assert
    await expect(addCandidate(candidateData)).rejects.toThrow(error.message);
  });
});
