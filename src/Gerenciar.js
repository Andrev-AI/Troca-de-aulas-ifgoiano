import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import prisma from '../lib/prisma';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';

const Gerenciar = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: "", subjects: [] });
  const [newSubject, setNewSubject] = useState("");

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedSubjects = await prisma.subject.findMany();
      const fetchedTeachers = await prisma.teacher.findMany({
        include: {
          subjects: true
        }
      });

      setSubjects(fetchedSubjects.map(s => s.name));
      setTeachers(fetchedTeachers.map(t => ({
        id: t.id,
        name: t.name,
        subjects: t.subjects.map(s => s.name)
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddTeacher = async () => {
    try {
      const createdTeacher = await prisma.teacher.create({
        data: {
          name: newTeacher.name,
          subjects: {
            connect: newTeacher.subjects.map(subject => ({
              name: subject
            }))
          }
        },
        include: {
          subjects: true
        }
      });

      setTeachers([...teachers, {
        id: createdTeacher.id,
        name: createdTeacher.name,
        subjects: createdTeacher.subjects.map(s => s.name)
      }]);
      setNewTeacher({ name: "", subjects: [] });
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleAddSubject = async () => {
    try {
      await prisma.subject.create({
        data: {
          name: newSubject
        }
      });
      setSubjects([...subjects, newSubject]);
      setNewSubject("");
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleRemoveSubject = async (subject) => {
    try {
      await prisma.subject.delete({
        where: {
          name: subject
        }
      });
      setSubjects(subjects.filter(sub => sub !== subject));
      setTeachers(teachers.map(teacher => ({
        ...teacher,
        subjects: teacher.subjects.filter(sub => sub !== subject)
      })));
    } catch (error) {
      console.error('Error removing subject:', error);
    }
  };
 return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Gerenciamento de Professores e Matérias</h1>
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Adicionar Matéria</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Nova Matéria"
            />
            <Button onClick={handleAddSubject}>Adicionar</Button>
          </div>
          <h3 className="text-lg font-bold mb-2">Matérias Existentes</h3>
          <ul className="mb-4">
            {subjects.map(subject => (
              <li key={subject} className="flex justify-between items-center mb-2">
                <span>{subject}</span>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveSubject(subject)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-bold mb-2">Adicionar Professor</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Nome do Professor"
            />
            <Select onValueChange={(value) => setNewTeacher(prev => ({ ...prev, subjects: [...prev.subjects, value] }))}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar Matéria" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddTeacher}>Adicionar</Button>
          </div>
          <h3 className="text-lg font-bold mb-2">Professores Existentes</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Professor</th>
                <th className="text-left p-2">Matérias</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => (
                <tr key={teacher.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="text"
                      value={teacher.name}
                      onChange={(e) => setTeachers(prev => prev.map(t => t.id === teacher.id ? { ...t, name: e.target.value } : t))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map(subject => (
                        <div key={subject} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                          <span>{subject}</span>
                          <button onClick={() => setTeachers(prev => prev.map(t => t.id === teacher.id ? { ...t, subjects: t.subjects.filter(sub => sub !== subject) } : t))}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                      <Select onValueChange={(value) => setTeachers(prev => prev.map(t => t.id === teacher.id ? { ...t, subjects: [...t.subjects, value] } : t))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Adicionar Matéria" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button variant="destructive" size="sm" onClick={() => setTeachers(prev => prev.filter(t => t.id !== teacher.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gerenciar;