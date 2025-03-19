import prisma from '../../../lib/prisma';
import { ClassData, FixedClass, Subject, Teacher } from '@/components/utils/types';

export const saveSchedule = async (schedule: ClassData[]) => {
  await Promise.all(
    schedule.map(async (cls) => {
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
};

export const getSchedule = async (): Promise<ClassData[]> => {
  return await prisma.classData.findMany();
};

export const saveFixedClasses = async (fixedClasses: FixedClass[]) => {
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
};

export const getFixedClasses = async (): Promise<FixedClass[]> => {
  return await prisma.fixedClass.findMany();
};

export const getSubjects = async (): Promise<Subject[]> => {
  return await prisma.subject.findMany();
};

export const saveSubjects = async (subjects: Subject[]) => {
  await Promise.all(
    subjects.map(async (subject) => {
      await prisma.subject.upsert({
        where: { id: subject.id },
        update: { name: subject.name },
        create: { id: subject.id, name: subject.name },
      });
    })
  );
};

export const getTeachers = async (): Promise<Teacher[]> => {
  const teachers = await prisma.teacher.findMany({
    include: {
      subjects: {
        select: {
          id: true,
        },
      },
    },
  });
  return teachers.map((teacher: { id: any; name: any; subjects: any[]; }) => ({
    id: teacher.id,
    name: teacher.name,
    subjects: teacher.subjects.map((s) => s.id),
  }));
};

export const saveTeachers = async (teachers: Teacher[]) => {
  await Promise.all(
    teachers.map(async (teacher) => {
      await prisma.teacher.upsert({
        where: { id: teacher.id },
        update: {
          name: teacher.name,
          subjects: {
            set: teacher.subjects.map((subjectId) => ({ id: subjectId })),
          },
        },
        create: {
          id: teacher.id,
          name: teacher.name,
          subjects: {
            connect: teacher.subjects.map((subjectId) => ({ id: subjectId })),
          },
        },
      });
    })
  );
};
