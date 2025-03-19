// components/utils/types.ts

// Interface para uma Matéria
export interface Subject {
    id: number;
    name: string;
  }
  
  // Interface para um Professor
  export interface Teacher {
    id: number;
    name: string;
    subjects: number[];
  }
  
  // Interface para uma Aula Regular (ClassData)
  export interface ClassData {
    id: number;
    dayIndex: number; 
    timeIndex: number; 
    subjectId: number; 
    teacherId: number; 
    date: string; 
    isFixed?: boolean; 
    className: string; 
  }
  
  // Interface para uma Aula Fixa (FixedClass)
  export interface FixedClass {
    date: string;
    id: number;
    dayIndex: number; 
    timeIndex: number; 
    subjectId: number; 
    teacherId: number; 
    className: string; 
  }
  
  export default {};