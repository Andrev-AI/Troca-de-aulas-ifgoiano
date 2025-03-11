export const saveSchedule = (schedule: ClassData[]) => {
  localStorage.setItem('schedule', JSON.stringify(schedule));
};

export const getSchedule = (): ClassData[] => {
  const saved = localStorage.getItem('schedule');
  return saved ? JSON.parse(saved) : [];
};
// Armazenamento de Matérias
export const getSubjects = () => {
  if (typeof window !== 'undefined') {
    const savedSubjects = localStorage.getItem('subjects');
    return savedSubjects ? JSON.parse(savedSubjects) : [];
  }
  return [];
};

export const saveSubjects = (subjects: Subject[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }
};

// Armazenamento de Professores
export const getTeachers = () => {
  if (typeof window !== 'undefined') {
    const savedTeachers = localStorage.getItem('teachers');
    return savedTeachers ? JSON.parse(savedTeachers) : [];
  }
  return [];
};

export const saveTeachers = (teachers: Teacher[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }
};

// Armazenamento de Aulas Fixas
// As aulas fixas serão exibidas na tabela principal e não poderão ser removidas
export const saveFixedClasses = (fixedClasses: FixedClass[]) => {
  localStorage.setItem('fixedClasses', JSON.stringify(fixedClasses));
};

export const getFixedClasses = (): FixedClass[] => {
  const saved = localStorage.getItem('fixedClasses');
  return saved ? JSON.parse(saved) : [];
};

// Interfaces e Tipos

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
  subjects: number[];
}

// Interface para aulas regulares (que podem ser modificadas)
// A propriedade isFixed indica se a aula é fixa (para controle na interface)
export interface ClassData {
  className: string;
  id: number;
  dayIndex: number;
  timeIndex: number;
  subjectId: number;
  teacherId: number;
  date: string;
  isFixed?: boolean; // Se true, a aula é fixa e não pode ser excluída ou modificada
}

// Interface para aulas fixas, armazenadas separadamente
export interface FixedClass {
  date: string;
  className: string;
  id: number;
  dayIndex: number;
  timeIndex: number;
  subjectId: number;
  teacherId: number;
}
