'use client';
import { ClassData as LocalClassData } from '@/components/utils/localStorage';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ScheduleTable from '@/components/ScheduleTable';
import { getSchedule, getSubjects, getTeachers } from '@/components/utils/localStorage';

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
  subjects: number[];
}

interface ClassData {
  id: number;
  dayIndex: number;
  timeIndex: number;
  subjectId: number;
  teacherId: number;
  date: string;
  className: string;
};

export default function Home() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const localSchedule = getSchedule();
    const formattedSchedule: ClassData[] = localSchedule.map((item: LocalClassData) => ({
      ...item,
      className: item.className || '',
    }));

    setSchedule(formattedSchedule);



    setSubjects(getSubjects());
    setTeachers(getTeachers());
  }, []);

  const currentWeek = new Date();

  const handleManageClick = () => {
    router.push('/gerenciar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Sistema de Troca de Aulas" 
        onManageClick={handleManageClick}
      />

      <main className="container mx-auto py-6 px-4">
        <ScheduleTable 
          schedule={schedule}
          setSchedule={setSchedule}
          subjects={subjects}
          teachers={teachers} 
          currentWeek={currentWeek}        />
      </main>
    </div>
  );
}
