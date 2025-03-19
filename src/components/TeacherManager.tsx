// components/TeacherManager.tsx
import { useState, useEffect } from 'react';
import { Subject, Teacher, FixedClass } from '@/components/utils/types'; // Importa tipos
import { getFixedClasses, saveFixedClasses } from '@/components/utils/db';

interface TeacherManagerProps {
  teachers: Teacher[];
  subjects: Subject[];
  onAddTeacher: (name: string, subjects: number[]) => void;
  onUpdateTeacherSubjects: (teacherId: number, subjects: number[]) => void;
  onDeleteTeacher: (teacherId: number) => void;
}

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const timeSlots = ['07:30 - 08:20', '08:20 - 09:10', '09:30 - 10:20', '10:20 - 11:10', '11:10 - 12:00'];
const classes = ['Agropecuária', 'Informática', 'Administração', 'Zootecnia'];

export default function TeacherManager({
  teachers,
  subjects,
  onAddTeacher,
  onUpdateTeacherSubjects,
  onDeleteTeacher,
}: TeacherManagerProps) {
  const [newTeacher, setNewTeacher] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [expandedTeacher, setExpandedTeacher] = useState<number | null>(null);

  // Estados para Aulas Fixas
  const [fixedClasses, setFixedClasses] = useState<FixedClass[]>([]);
  const [isFixedModalOpen, setIsFixedModalOpen] = useState<boolean>(false);
  const [fixedModalMode, setFixedModalMode] = useState<'new' | 'edit' | 'clone'>('new');
  const [fixedClassForm, setFixedClassForm] = useState<{
    id?: number;
    dayIndex: number;
    timeIndex: number;
    subjectId: number;
    teacherId: number;
    className: string;
  }>({
    dayIndex: 0,
    timeIndex: 0,
    subjectId: subjects.length > 0 ? subjects[0].id : 0,
    teacherId: teachers.length > 0 ? teachers[0].id : 0,
    className: classes[0] || '',
  });

  // Carregar aulas fixas do banco
  useEffect(() => {
    const loadFixedClasses = async () => {
      const data = await getFixedClasses();
      setFixedClasses(data);
    };
    loadFixedClasses();
  }, []);

  // Gerenciamento de Professores
  const handleSubmitTeacher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTeacher.trim() && selectedSubjects.length > 0) {
      onAddTeacher(newTeacher.trim(), selectedSubjects.map((id) => parseInt(id)));
      setNewTeacher('');
      setSelectedSubjects([]);
    } else {
      alert('Por favor, insira um nome e selecione pelo menos uma matéria.');
    }
  };

  const handleSubjectToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjectId = e.target.value;
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const handleTeacherSubjectToggle = (teacherId: number, subjectId: number) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    let updatedSubjects = [...teacher.subjects];
    if (updatedSubjects.includes(subjectId)) {
      updatedSubjects = updatedSubjects.filter((id) => id !== subjectId);
    } else {
      updatedSubjects.push(subjectId);
    }
    onUpdateTeacherSubjects(teacherId, updatedSubjects);
  };

  const toggleTeacherExpand = (teacherId: number) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
  };

  // Funções do Modal de Aulas Fixas
  const openFixedModal = (mode: 'new' | 'edit' | 'clone', fixedClass?: FixedClass) => {
    if (mode === 'new') {
      setFixedClassForm({
        dayIndex: 0,
        timeIndex: 0,
        subjectId: subjects.length > 0 ? subjects[0].id : 0,
        teacherId: teachers.length > 0 ? teachers[0].id : 0,
        className: classes[0] || '',
      });
    } else if (fixedClass) {
      setFixedClassForm({
        id: fixedClass.id,
        dayIndex: fixedClass.dayIndex,
        timeIndex: fixedClass.timeIndex,
        subjectId: fixedClass.subjectId,
        teacherId: fixedClass.teacherId,
        className: fixedClass.className,
      });
      if (mode === 'clone') {
        setFixedClassForm((prev) => ({ ...prev, id: undefined }));
      }
    }
    setFixedModalMode(mode);
    setIsFixedModalOpen(true);
  };

  const handleFixedModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFixedClassForm((prev) => ({
      ...prev,
      [name]:
        name === 'dayIndex' || name === 'timeIndex' || name === 'subjectId' || name === 'teacherId'
          ? parseInt(value)
          : value,
    }));
  };

  const handleFixedModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const conflict = fixedClasses.find(
      (fc) =>
        fc.dayIndex === fixedClassForm.dayIndex &&
        fc.timeIndex === fixedClassForm.timeIndex &&
        fc.className === fixedClassForm.className &&
        fc.id !== fixedClassForm.id
    );
    if (conflict) {
      alert('Já existe uma aula fixa nesse horário para essa turma.');
      return;
    }

    let updatedFixedClasses: FixedClass[];

    if (fixedModalMode === 'edit' && fixedClassForm.id) {
      updatedFixedClasses = fixedClasses.map((fc) =>
        fc.id === fixedClassForm.id ? { ...fixedClassForm, id: fc.id, date: fc.date } : fc
      );
    } else {
      const newFixedClass: FixedClass = {
        id: Date.now(),
        dayIndex: fixedClassForm.dayIndex,
        timeIndex: fixedClassForm.timeIndex,
        subjectId: fixedClassForm.subjectId,
        teacherId: fixedClassForm.teacherId,
        className: fixedClassForm.className,
        date: ''
      };
      updatedFixedClasses = [...fixedClasses, newFixedClass];
    }

    setFixedClasses(updatedFixedClasses);
    await saveFixedClasses(updatedFixedClasses);
    setIsFixedModalOpen(false);
  };

  const handleDeleteFixedClass = async (classId: number) => {
    const updatedClasses = fixedClasses.filter((fc) => fc.id !== classId);
    setFixedClasses(updatedClasses);
    await saveFixedClasses(updatedClasses); 
  };

  return (
    <div className="p-6 text-black">
      {/* Gerenciamento de Professores */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Gerenciar Professores</h2>

        <form onSubmit={handleSubmitTeacher} className="mb-6">
          <div className="mb-4">
            <input
              type="text"
              value={newTeacher}
              onChange={(e) => setNewTeacher(e.target.value)}
              placeholder="Nome do professor"
              className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Matérias lecionadas
            </label>
            <div className="max-h-40 overflow-y-auto p-2 border rounded-md">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center mb-2 text-black">
                  <input
                    type="checkbox"
                    id={`new-subject-${subject.id}`}
                    value={subject.id}
                    checked={selectedSubjects.includes(subject.id.toString())}
                    onChange={handleSubjectToggle}
                    className="mr-2"
                  />
                  <label htmlFor={`new-subject-${subject.id}`}>{subject.name}</label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Adicionar Professor
          </button>
        </form>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Professores Cadastrados</h3>
          {teachers.length === 0 ? (
            <p className="text-gray-800 italic">Nenhum professor cadastrado</p>
          ) : (
            <ul className="divide-y divide-gray-600">
              {teachers.map((teacher) => (
                <li key={teacher.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleTeacherExpand(teacher.id)}
                      className="flex items-center text-left focus:outline-none"
                    >
                      <span className="mr-2">{expandedTeacher === teacher.id ? '▼' : '►'}</span>
                      <span className="teacher-name">{teacher.name}</span>
                    </button>
                    <button
                      onClick={() => onDeleteTeacher(teacher.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </div>

                  {expandedTeacher === teacher.id && (
                    <div className="mt-3 pl-6 text-black">
                      <h4 className="font-medium text-sm mb-2">Matérias lecionadas:</h4>
                      <div className="max-h-40 overflow-y-auto p-2 border rounded-md">
                        {subjects.map((subject) => (
                          <div key={subject.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`teacher-${teacher.id}-subject-${subject.id}`}
                              checked={teacher.subjects.includes(subject.id)}
                              onChange={() => handleTeacherSubjectToggle(teacher.id, subject.id)}
                              className="mr-2"
                            />
                            <label htmlFor={`teacher-${teacher.id}-subject-${subject.id}`}>
                              {subject.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Gerenciador de Aulas Fixas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl kritik-semibold mb-4">Gerenciar Aulas Fixas</h2>
        <div className="mb-2 text-gray-600 text-sm">
          Aulas fixas são aulas regulares que não podem ser trocadas ou excluídas na grade normal.
        </div>
        <button
          onClick={() => openFixedModal('new')}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Adicionar Aula Fixa
        </button>

        {fixedClasses.length === 0 ? (
          <p className="text-gray-500 italic">Nenhuma aula fixa cadastrada</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Turma</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dia</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Horário</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Matéria</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Professor</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fixedClasses.map((fc) => (
                <tr key={fc.id}>
                  <td className="px-4 py-2 text-sm">{fc.className}</td>
                  <td className="px-4 py-2 text-sm">{weekDays[fc.dayIndex]}</td>
                  <td className="px-4 py-2 text-sm">{timeSlots[fc.timeIndex]}</td>
                  <td className="px-4 py-2 text-sm">
                    {subjects.find((s) => s.id === fc.subjectId)?.name || 'Matéria não encontrada'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {teachers.find((t) => t.id === fc.teacherId)?.name || 'Professor não encontrado'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => openFixedModal('edit', fc)}
                      className="mr-2 text-green-500 hover:text-green-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openFixedModal('clone', fc)}
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      Clonar
                    </button>
                    <button
                      onClick={() => handleDeleteFixedClass(fc.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para Gerenciar Aulas Fixas */}
      {isFixedModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {fixedModalMode === 'new'
                ? 'Adicionar Aula Fixa'
                : fixedModalMode === 'edit'
                ? 'Editar Aula Fixa'
                : 'Clonar Aula Fixa'}
            </h2>
            <form onSubmit={handleFixedModalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Turma</label>
                <select
                  name="className"
                  value={fixedClassForm.className}
                  onChange={handleFixedModalChange}
                  className="w-full border rounded py-2 px-3"
                >
                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Dia da Semana</label>
                <select
                  name="dayIndex"
                  value={fixedClassForm.dayIndex}
                  onChange={handleFixedModalChange}
                  className="w-full border rounded py-2 px-3"
                >
                  {weekDays.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Horário</label>
                <select
                  name="timeIndex"
                  value={fixedClassForm.timeIndex}
                  onChange={handleFixedModalChange}
                  className="w-full border rounded py-2 px-3"
                >
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={index}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Matéria</label>
                <select
                  name="subjectId"
                  value={fixedClassForm.subjectId}
                  onChange={handleFixedModalChange}
                  className="w-full border rounded py-2 px-3"
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Professor</label>
                <select
                  name="teacherId"
                  value={fixedClassForm.teacherId}
                  onChange={handleFixedModalChange}
                  className="w-full border rounded py-2 px-3"
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFixedModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {fixedModalMode === 'edit' ? 'Salvar' : fixedModalMode === 'clone' ? 'Clonar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}