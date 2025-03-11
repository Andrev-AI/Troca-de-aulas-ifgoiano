export const saveSchedule = (schedule: ClassData[]) => {
  localStorage.setItem('schedule', JSON.stringify(schedule));
};

export const getSchedule = (): ClassData[] => {
  const saved = localStorage.getItem('schedule');
  return saved ? JSON.parse(saved) : [];
};

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

export interface ClassData {
  className: string;
  id: number;
  dayIndex: number;
  timeIndex: number;
  subjectId: number;
  teacherId: number;
  date: string;
  isFixed?: boolean; 
}

export interface FixedClass {
  date: string;
  className: string;
  id: number;
  dayIndex: number;
  timeIndex: number;
  subjectId: number;
  teacherId: number;
}
