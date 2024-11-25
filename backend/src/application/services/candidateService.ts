import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

export const setPrismaInstance = (client: PrismaClient) => {
    prismaInstance = client;
};

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData);
        
        const result = await prismaInstance.candidate.create({
            data: {
                firstName: candidateData.firstName,
                lastName: candidateData.lastName,
                email: candidateData.email,
                phone: candidateData.phone,
                address: candidateData.address,
                educations: candidateData.educations ? {
                    create: candidateData.educations
                } : undefined,
                workExperiences: candidateData.workExperiences ? {
                    create: candidateData.workExperiences
                } : undefined,
                resumes: candidateData.cv ? {
                    create: [{
                        ...candidateData.cv,
                        uploadDate: new Date()
                    }]
                } : undefined
            },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true
            }
        });
        
        return result;
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            throw new Error('The email already exists in the database');
        }
        if (error.name === 'PrismaClientInitializationError') {
            throw new Error('Database connection failed');
        }
        throw error;
    }
};