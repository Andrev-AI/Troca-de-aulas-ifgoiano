import React, { useState } from 'react';
import { saveSchedule } from '@/components/utils/localStorage';
import { FiEdit, FiCopy } from 'react-icons/fi';
import { ClassData } from './utils/localStorage';

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
  subjects: number[];
}

interface FixedClassManagerProps {
  schedule: ClassData[];
  setSchedule: React.Dispatch<React.SetStateAction<ClassData[]>>;
  subjects: Subject[];
  teachers: Teacher[];
}

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const timeSlots = [
  '07:30 - 08:20',
  '08:20 - 09:10',
  '09:30 - 10:20',
  '10:20 - 11:10',
  '11:10 - 12:00'
];

export default function FixedClassManager({ schedule, setSchedule, subjects, teachers }: FixedClassManagerProps) {
  // Filtra apenas as aulas fixas
  const fixedClasses = schedule.filter(cls => cls.isFixed);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Guarda o horário selecionado para criação ou edição
  const [selectedSlot, setSelectedSlot] = useState<{ dayIndex: number; timeIndex: number } | null>(null);
  // Se houver aula fixa sendo editada ou clonada
  const [currentFixedClass, setCurrentFixedClass] = useState<ClassData | null>(null);

  // Abre modal para criação de nova aula fixa
  const openModalForSlot = (dayIndex: number, timeIndex: number) => {
    setSelectedSlot({ dayIndex, timeIndex });
    setCurrentFixedClass(null);
    setIsModalOpen(true);
  };

  // Abre modal para editar aula fixa existente
  const openModalForEdit = (cls: ClassData) => {
    setSelectedSlot({ dayIndex: cls.dayIndex, timeIndex: cls.timeIndex });
    setCurrentFixedClass(cls);
    setIsModalOpen(true);
  };

  // Abre modal para clonar: preenche dados da aula e permite escolher novo horário
  const openModalForClone = (cls: ClassData) => {
    setSelectedSlot(null);
    // Cria cópia da aula para clonar (novo ID será gerado na hora de salvar)
    setCurrentFixedClass({ ...cls, id: Date.now() });
    setIsModalOpen(true);
  };

  const handleSaveFixedClass = (data: { subjectId: number; teacherId: number }) => {
    if (!selectedSlot) {
      alert('Por favor, selecione um horário para a aula fixa.');
      return;
    }
    const { subjectId, teacherId } = data;

    // Verifica conflito: não pode haver outra aula fixa no mesmo horário (exceto na edição da própria aula)
    const conflict = schedule.find(cls =>
      cls.isFixed &&
      cls.dayIndex === selectedSlot.dayIndex &&
      cls.timeIndex === selectedSlot.timeIndex &&
      (!currentFixedClass || cls.id !== currentFixedClass.id)
    );
    if (conflict) {
      alert('Já existe uma aula fixa neste horário.');
      return;
    }

    if (currentFixedClass) {
      // Atualiza aula fixa existente (edição ou clonagem)
      const updatedFixedClass: ClassData = {
        ...currentFixedClass,
        dayIndex: selectedSlot.dayIndex,
        timeIndex: selectedSlot.timeIndex,
        subjectId,
        teacherId,
        isFixed: true,
        className: ''
      };
      const updatedSchedule = schedule.map(cls => cls.id === currentFixedClass.id ? updatedFixedClass : cls);
      setSchedule(updatedSchedule);
      saveSchedule(updatedSchedule);
    } else {
      // Cria nova aula fixa
      const newFixedClass: ClassData = {
        id: Date.now(),
        dayIndex: selectedSlot.dayIndex,
        timeIndex: selectedSlot.timeIndex,
        subjectId,
        teacherId,
        date: '', // Para aulas fixas, a data pode ser ignorada ou definida como padrão
        isFixed: true,
        className: ''
      };
      const updatedSchedule = [...schedule, newFixedClass];
      setSchedule(updatedSchedule);
      saveSchedule(updatedSchedule);
    }
    setIsModalOpen(false);
    setSelectedSlot(null);
    setCurrentFixedClass(null);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Gerenciar Aulas Fixas</h2>

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Aulas Fixas Agendadas</h3>
        {fixedClasses.length === 0 ? (
          <p className="text-gray-600">Nenhuma aula fixa agendada.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Dia</th>
                <th className="px-4 py-2">Horário</th>
                <th className="px-4 py-2">Matéria</th>
                <th className="px-4 py-2">Professor</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {fixedClasses.map(cls => (
                <tr key={cls.id} className="border-b">
                  {/* <td className="px-4 py-2">{weekDays[cls.dayIndex]}</td> */}
                  {/* <td className="px-4 py-2">{timeSlots[cls.timeIndex]}</td> */}
                  <td className="px-4 py-2">
                    {subjects.find(sub => sub.id === cls.subjectId)?.name || 'Matéria não encontrada'}
                  </td>
                  <td className="px-4 py-2">
                    {teachers.find(t => t.id === cls.teacherId)?.name || 'Professor não encontrado'}
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button onClick={() => openModalForEdit(cls)} className="text-blue-600 hover:text-blue-800">
                      <FiEdit />
                    </button>
                    <button onClick={() => openModalForClone(cls)} className="text-green-600 hover:text-green-800">
                      <FiCopy />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h3 className="text-xl font-medium mb-2">Criar Nova Aula Fixa</h3>
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Horário/Dia</th>
              {weekDays.map((day, index) => (
                <th key={index} className="px-4 py-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, timeIndex) => (
              <tr key={timeIndex} className="border-b">
                <td className="px-4 py-2">{slot}</td>
                {weekDays.map((_, dayIndex) => {
                  const fixed = schedule.find(cls => cls.isFixed && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex);
                  return (
                    <td key={dayIndex} className="px-4 py-2 text-center">
                      {fixed ? (
                        <span className="text-gray-500">Ocupado</span>
                      ) : (
                        <button onClick={() => openModalForSlot(dayIndex, timeIndex)} className="text-blue-600 hover:text-blue-800">
                          Adicionar
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <FixedClassModal 
          onClose={() => { setIsModalOpen(false); setSelectedSlot(null); setCurrentFixedClass(null); }} 
          onSave={handleSaveFixedClass} 
          subjects={subjects} 
          teachers={teachers} 
          selectedSlot={selectedSlot} 
          currentFixedClass={currentFixedClass}
        />
      )}
    </div>
  );
}

interface FixedClassModalProps {
  onClose: () => void;
  onSave: (data: { subjectId: number; teacherId: number }) => void;
  subjects: Subject[];
  teachers: Teacher[];
  selectedSlot: { dayIndex: number; timeIndex: number } | null;
  currentFixedClass: ClassData | null;
}

function FixedClassModal({ onClose, onSave, subjects, teachers, selectedSlot, currentFixedClass }: FixedClassModalProps) {
  const [subjectId, setSubjectId] = useState(currentFixedClass ? currentFixedClass.subjectId : subjects[0]?.id || 0);
  const [teacherId, setTeacherId] = useState(currentFixedClass ? currentFixedClass.teacherId : teachers[0]?.id || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ subjectId, teacherId });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-semibold mb-4">
          {currentFixedClass ? 'Editar Aula Fixa' : 'Criar Aula Fixa'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Matéria</label>
            <select 
              value={subjectId} 
              onChange={(e) => setSubjectId(Number(e.target.value))} 
              className="w-full border rounded p-2"
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Professor</label>
            <select 
              value={teacherId} 
              onChange={(e) => setTeacherId(Number(e.target.value))} 
              className="w-full border rounded p-2"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              {selectedSlot ? `Horário selecionado: ${weekDays[selectedSlot.dayIndex]} - ${timeSlots[selectedSlot.timeIndex]}` : 'Selecione um horário na tabela acima.'}
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
