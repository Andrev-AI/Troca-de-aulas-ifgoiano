'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { getSubjects, getTeachers, saveSubjects, saveTeachers } from '@/components/utils/db';
import TeacherManager from '@/components/TeacherManager';
import { Subject, Teacher } from '@/components/utils/types';

export default function Manage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newSubject, setNewSubject] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const dbSubjects = await getSubjects();
      const dbTeachers = await getTeachers();
      setSubjects(dbSubjects);
      setTeachers(dbTeachers);
    };
    loadData();
  }, []);

  const handleAddSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newSubject.trim()) {
      const updatedSubjects = [...subjects, { id: Date.now(), name: newSubject.trim() }];
      setSubjects(updatedSubjects);
      await saveSubjects(updatedSubjects);
      setNewSubject('');
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    const isUsedByTeacher = teachers.some(teacher => teacher.subjects.includes(subjectId));
    if (isUsedByTeacher) {
      alert('Essa matéria está atribuída a um ou mais professores e não pode ser excluída.');
      return;
    }
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    setSubjects(updatedSubjects);
    await saveSubjects(updatedSubjects);
  };

  const handleAddTeacher = async (name: string, subjects: number[]) => {
    const updatedTeachers = [...teachers, { id: Date.now(), name, subjects }];
    setTeachers(updatedTeachers);
    await saveTeachers(updatedTeachers);
  };

  const handleUpdateTeacherSubjects = async (teacherId: number, newSubjects: number[]) => {
    const updatedTeachers = teachers.map(teacher =>
      teacher.id === teacherId ? { ...teacher, subjects: newSubjects } : teacher
    );
    setTeachers(updatedTeachers);
    await saveTeachers(updatedTeachers);
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    const updatedTeachers = teachers.filter(teacher => teacher.id !== teacherId);
    setTeachers(updatedTeachers);
    await saveTeachers(updatedTeachers);
  };

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Gerenciar Sistema" 
        showManage={false}
        onBackClick={handleBackClick}
      />

      <main className="container mx-auto py-6 px-4 text-black">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Criar Matéria</h2>
          <form onSubmit={handleAddSubject} className="mb-6">
            <div className="flex">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Nome da matéria"
                className="flex-grow shadow appearance-none border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
              >
                Adicionar
              </button>
            </div>
          </form>
          {subjects.length === 0 ? (
            <p className="text-gray-500 italic">Nenhuma matéria cadastrada</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {subjects.map(subject => (
                <li key={subject.id} className="py-3 flex justify-between items-center">
                  <span>{subject.name}</span>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <TeacherManager 
          teachers={teachers}
          subjects={subjects}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacherSubjects={handleUpdateTeacherSubjects}
          onDeleteTeacher={handleDeleteTeacher}
        />
      </main>
    </div>
  );
}