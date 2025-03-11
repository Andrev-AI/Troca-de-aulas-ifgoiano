import { useState, useEffect } from 'react';

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
  subjects: number[];
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { subjectId: number; teacherId: number; date: string }) => void;
  subjects: Subject[];
  teachers: Teacher[];
  currentWeek: string;
}

export default function ClassModal({ 
  isOpen, 
  onClose, 
  onSave, 
  subjects, 
  teachers, 
  currentWeek 
}: ClassModalProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [eligibleTeachers, setEligibleTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    if (selectedSubject) {
      const filtered = teachers.filter(teacher => 
        teacher.subjects.includes(parseInt(selectedSubject))
      );
      setEligibleTeachers(filtered);
      setSelectedTeacher('');
    } else {
      setEligibleTeachers([]);
    }
  }, [selectedSubject, teachers]);

  useEffect(() => {
    if (isOpen) {
      const date = new Date(currentWeek);
      const formattedDate = date.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
      setSelectedSubject('');
      setSelectedTeacher('');
    }
  }, [isOpen, currentWeek]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedSubject || !selectedTeacher || !selectedDate) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    onSave({
      subjectId: parseInt(selectedSubject),
      teacherId: parseInt(selectedTeacher),
      date: selectedDate
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-black">Adicionar Aula</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Matéria
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Selecione uma matéria</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Professor
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={!selectedSubject}
              required
            >
              <option value="">Selecione um professor</option>
              {eligibleTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Data
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}