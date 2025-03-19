'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ScheduleTable from '@/components/ScheduleTable';
import { getSchedule, getFixedClasses } from '@/components/utils/localStorage';
import prisma from '../../lib/prisma';
import { ClassData, Subject, Teacher } from '@/components/utils/types';

export default function Home() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      const dbSchedule = await getSchedule();
      const fixedClasses = await getFixedClasses();
      
      const formattedSchedule: ClassData[] = [
        ...dbSchedule,
        ...fixedClasses.map((fc) => ({
          ...fc,
          date: new Date().toISOString().split('T')[0],
          isFixed: true,
        })),
      ].map((item: ClassData) => ({
        ...item,
        className: item.className || '',
      }));

      setSchedule(formattedSchedule);

      const dbSubjects = await prisma.subject.findMany();
      const dbTeachers = await prisma.teacher.findMany({
        include: {
          subjects: { select: { id: true } },
        },
      });

      const formattedTeachers: Teacher[] = dbTeachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        subjects: teacher.subjects.map((s) => s.id),
      }));

      setSubjects(dbSubjects);
      setTeachers(formattedTeachers);
    };

    loadData();
  }, []);

  const currentWeek = new Date();

  const handleManageClick = () => {
    router.push('/gerenciar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Sistema de Troca de Aulas" onManageClick={handleManageClick} />
      <main className="container mx-auto py-6 px-4">
        <ScheduleTable
          schedule={schedule}
          setSchedule={setSchedule}
          subjects={subjects}
          teachers={teachers}
          currentWeek={currentWeek}
        />
      </main>
    </div>
  );
}