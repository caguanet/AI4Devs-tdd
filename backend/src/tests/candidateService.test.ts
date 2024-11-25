import { PrismaClient } from '@prisma/client';
import { addCandidate, setPrismaInstance } from '../application/services/candidateService';

const mockCreate = jest.fn();
const mockPrismaClient = {
    candidate: {
        create: mockCreate
    },
    $disconnect: jest.fn(),
    $connect: jest.fn()
};

// Configuración del mock antes de los tests
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
}));

describe('Inserción de Candidatos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setPrismaInstance(mockPrismaClient as unknown as PrismaClient);
    });

    const candidatoCompleto = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '612345678',
        address: 'Calle Falsa 123',
        educations: [{
            institution: 'Universidad de Madrid',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
        }],
        workExperiences: [{
            company: 'Tech SA',
            position: 'Desarrollador',
            startDate: '2022-07-01',
            endDate: '2023-12-31'
        }]
    };

    it('debería guardar un candidato completo con relaciones', async () => {
        const candidatoGuardado = { id: 1, ...candidatoCompleto };
        mockCreate.mockResolvedValueOnce(candidatoGuardado);

        const resultado = await addCandidate(candidatoCompleto);

        expect(resultado).toHaveProperty('id', 1);
        expect(mockCreate).toHaveBeenCalledWith({
            data: {
                firstName: candidatoCompleto.firstName,
                lastName: candidatoCompleto.lastName,
                email: candidatoCompleto.email,
                phone: candidatoCompleto.phone,
                address: candidatoCompleto.address,
                educations: {
                    create: candidatoCompleto.educations
                },
                workExperiences: {
                    create: candidatoCompleto.workExperiences
                },
                resumes: undefined
            },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true
            }
        });
    });

    it('debería lanzar un error si el email ya existe', async () => {
        const error = new Error('The email already exists in the database');
        
        mockPrismaClient.candidate.create.mockRejectedValueOnce(error);

        await expect(addCandidate(candidatoCompleto))
            .rejects
            .toThrow('The email already exists in the database');
    });

    it('debería rechazar datos inválidos', async () => {
        const datosInvalidos = {
            ...candidatoCompleto,
            email: 'correo-invalido'
        };

        await expect(addCandidate(datosInvalidos))
            .rejects
            .toThrow('Invalid email');
    });

    it('debería manejar errores de conexión', async () => {
        const error = new Error('Database connection failed');
        error.name = 'PrismaClientInitializationError';
        
        (mockPrismaClient.candidate.create as jest.Mock).mockRejectedValueOnce(error);

        await expect(addCandidate(candidatoCompleto))
            .rejects
            .toThrow('Database connection failed');
    });
});
