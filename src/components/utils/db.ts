import prisma from '../../../lib/prisma';
import { ClassData, FixedClass, Subject, Teacher } from '@/components/utils/types';
import { Teacher as PrismaTeacher } from '@prisma/client';

export const saveSchedule = async (schedule: ClassData[]): Promise<void> => {
  try {
    await Promise.all(
      schedule.map(async (cls: ClassData) => {
        await prisma.classData.upsert({
          where: { id: cls.id },
          update: {
            dayIndex: cls.dayIndex,
            timeIndex: cls.timeIndex,
            subjectId: cls.subjectId,
            teacherId: cls.teacherId,
            date: cls.date,
            isFixed: cls.isFixed || false,
            className: cls.className,
          },
          create: {
            id: cls.id,
            dayIndex: cls.dayIndex,
            timeIndex: cls.timeIndex,
            subjectId: cls.subjectId,
            teacherId: cls.teacherId,
            date: cls.date,
            isFixed: cls.isFixed || false,
            className: cls.className,
          },
        });
      })
    );
  } catch (error) {
    console.error('Error saving schedule:', error);
    throw new Error('Failed to save schedule');
  }
};

export const getSchedule = async (): Promise<ClassData[]> => {
  try {
    return prisma.classData.findMany();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw new Error('Failed to fetch schedule');
  }
};

export const saveFixedClasses = async (fixedClasses: FixedClass[]): Promise<void> => {
  try {
    await Promise.all(
      fixedClasses.map(async (fc: FixedClass) => {
        await prisma.fixedClass.upsert({
          where: { id: fc.id },
          update: {
            dayIndex: fc.dayIndex,
            timeIndex: fc.timeIndex,
            subjectId: fc.subjectId,
            teacherId: fc.teacherId,
            className: fc.className,
          },
          create: {
            id: fc.id,
            dayIndex: fc.dayIndex,
            timeIndex: fc.timeIndex,
            subjectId: fc.subjectId,
            teacherId: fc.teacherId,
            className: fc.className,
          },
        });
      })
    );
  } catch (error) {
    console.error('Error saving fixed classes:', error);
    throw new Error('Failed to save fixed classes');
  }
};

export const getFixedClasses = async (): Promise<FixedClass[]> => {
  try {
    const fixedClasses = await prisma.fixedClass.findMany();
    return fixedClasses.map(fc => ({ ...fc, date: new Date().toISOString() }));
  } catch (error) {
    console.error('Error fetching fixed classes:', error);
    throw new Error('Failed to fetch fixed classes');
  }
};

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const subjects = await prisma.subject.findMany();
    return subjects;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw new Error('Failed to fetch subjects');
  }
};

export const saveSubjects = async (subjects: Subject[]): Promise<void> => {
  try {
    await Promise.all(
      subjects.map(async (subject: Subject) => {
        await prisma.subject.upsert({
          where: { id: subject.id },
          update: { name: subject.name },
          create: { id: subject.id, name: subject.name },
        });
      })
    );
  } catch (error) {
    console.error('Error saving subjects:', error);
    throw new Error('Failed to save subjects');
  }
};

export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const teachers: (PrismaTeacher & { subjects: { id: number }[] })[] = await prisma.teacher.findMany({
      include: {
        subjects: {
          select: {
            id: true,
          },
        },
      },
    });
    return teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      subjects: teacher.subjects.map((s: { id: number }) => s.id),
    }));
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw new Error('Failed to fetch teachers');
  }
};

export const saveTeachers = async (teachers: Teacher[]): Promise<void> => {
  try {
    await Promise.all(
      teachers.map(async (teacher: Teacher) => {
        await prisma.teacher.upsert({
          where: { id: teacher.id },
          update: {
            name: teacher.name,
            subjects: {
              set: teacher.subjects.map((subjectId: number) => ({ id: subjectId })),
            },
          },
          create: {
            id: teacher.id,
            name: teacher.name,
            subjects: {
              connect: teacher.subjects.map((subjectId: number) => ({ id: subjectId })),
            },
          },
        });
      })
    );
  } catch (error) {
    console.error('Error saving teachers:', error);
    throw new Error('Failed to save teachers');
  }
};