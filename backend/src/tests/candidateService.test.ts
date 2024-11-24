import { addCandidate, setPrismaInstance } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const actualPrismaClient = jest.requireActual('@prisma/client');
  return {
    ...actualPrismaClient,
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '612345678',
          address: 'Calle Falsa 123',
          educations: [
            {
              institution: 'Universidad de Ejemplo',
              title: 'Ingeniería',
              startDate: '2020-01-01',
              endDate: '2024-01-01',
            },
          ],
          workExperiences: [
            {
              company: 'Empresa Ejemplo',
              position: 'Desarrollador',
              startDate: '2021-01-01',
              endDate: '2022-01-01',
            },
          ],
          cv: {
            filePath: '/path/to/cv.pdf',
            fileType: 'application/pdf',
          },
        }),
      },
      education: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniería',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
        }),
      },
      workExperience: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          startDate: '2021-01-01',
          endDate: '2022-01-01',
        }),
      },
      resume: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          candidateId: 1,
          filePath: '/path/to/cv.pdf',
          fileType: 'application/pdf',
          uploadDate: new Date(),
        }),
      },
    })),
  };
});

const mockPrisma = new PrismaClient();

describe('Inserción de Candidatos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPrismaInstance(mockPrisma);
  });

  it('debería guardar un candidato válido en la base de datos', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      educations: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniería',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
        },
      ],
      workExperiences: [
        {
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          startDate: '2021-01-01',
          endDate: '2022-01-01',
        },
      ],
      cv: {
        filePath: '/path/to/cv.pdf',
        fileType: 'application/pdf',
      },
    };

    const result = await addCandidate(candidateData);

    expect(result).toHaveProperty('id');
    expect(result.firstName).toBe('Juan');
    expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
      }),
    });
  });

  it('debería lanzar un error si el email ya existe', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
    };

    (mockPrisma.candidate.create as jest.Mock).mockRejectedValueOnce(new Error('The email already exists in the database'));

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'The email already exists in the database'
    );
  });
});
