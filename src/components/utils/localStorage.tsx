import prisma from '../../../lib/prisma';
import { ClassData, FixedClass } from '@/components/utils/types';

export const saveSchedule = async (schedule: ClassData[]): Promise<void> => {
  try {
    await Promise.all(
      schedule.map(async (cls) => {
        await prisma.classData.upsert({
          where: { id: cls.id },
          update: {
            dayIndex: cls.dayIndex,
            timeIndex: cls.timeIndex,
            subjectId: cls.subjectId,
            teacherId: cls.teacherId,
            date: cls.date || new Date().toISOString().split('T')[0],
            isFixed: cls.isFixed || false,
            className: cls.className,
          },
          create: {
            id: cls.id,
            dayIndex: cls.dayIndex,
            timeIndex: cls.timeIndex,
            subjectId: cls.subjectId,
            teacherId: cls.teacherId,
            date: cls.date || new Date().toISOString().split('T')[0],
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
      fixedClasses.map(async (fc) => {
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
    return fixedClasses.map(fc => ({
      ...fc,
      date: new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching fixed classes:', error);
    throw new Error('Failed to fetch fixed classes');
  }
};

export type { ClassData };