import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { saveSchedule, getFixedClasses, FixedClass } from '@/components/utils/localStorage';
import ClassModal from "./ClassModal";

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
  isFixed?: boolean;
  className: string;
}

interface ScheduleTableProps {
  currentWeek: Date;
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

const classes = ['Agropecuária', 'Informática', 'Administração', 'Zootecnia'];

export default function ScheduleTable({
  currentWeek,
  schedule,
  setSchedule,
  subjects,
  teachers,
}: ScheduleTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ dayIndex: number; timeIndex: number } | null>(null);
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [combinedSchedule, setCombinedSchedule] = useState<ClassData[]>([]);

  const currentClassName = classes[currentClassIndex];

  useEffect(() => {
    const fixedClasses = getFixedClasses()
      .filter((fc: FixedClass) => fc.className === currentClassName)
      .map((fc: FixedClass) => ({
        ...fc,
        isFixed: true,
      }));

    const filteredSchedule = schedule
      .filter((cls) => cls.className === currentClassName && !cls.isFixed);

    setCombinedSchedule([...filteredSchedule, ...fixedClasses]);
  }, [schedule, currentClassIndex]);

  const handlePreviousClass = () => {
    setCurrentClassIndex((prev) => (prev > 0 ? prev - 1 : classes.length - 1));
  };

  const handleNextClass = () => {
    setCurrentClassIndex((prev) => (prev < classes.length - 1 ? prev + 1 : 0));
  };

  const handleAddClass = (dayIndex: number, timeIndex: number) => {
    setSelectedSlot({ dayIndex, timeIndex });
    setIsModalOpen(true);
  };

  const handleSaveClass = (data: { subjectId: number; teacherId: number; date: string }) => {
    if (!selectedSlot) return;
    const { subjectId, teacherId, date } = data;

    const classesSameDate = combinedSchedule.filter(
      (cls) => new Date(cls.date).toDateString() === new Date(date).toDateString()
    );
    const conflictingClass = classesSameDate.find(
      (cls) =>
        cls.dayIndex === selectedSlot.dayIndex &&
        cls.timeIndex === selectedSlot.timeIndex &&
        (cls.teacherId !== teacherId || cls.subjectId !== subjectId)
    );

    if (conflictingClass) {
      alert('Não é possível adicionar matérias diferentes no mesmo horário e data.');
      return;
    }

    const newClass: ClassData = {
      id: Date.now(),
      dayIndex: selectedSlot.dayIndex,
      timeIndex: selectedSlot.timeIndex,
      subjectId,
      teacherId,
      date,
      isFixed: false,
      className: currentClassName,
    };

    const updatedSchedule = [...schedule.filter((cls) => !cls.isFixed), newClass];
    setSchedule(updatedSchedule);
    saveSchedule(updatedSchedule);
    setIsModalOpen(false);
  };

  const handleDeleteClass = (classId: number) => {
    const updatedSchedule = schedule.filter((cls) => cls.id !== classId);
    setSchedule(updatedSchedule);
    saveSchedule(updatedSchedule);
  };

  const getClassesForSlot = (dayIndex: number, timeIndex: number): ClassData[] => {
    return combinedSchedule.filter(
      (cls) => cls.dayIndex === dayIndex && cls.timeIndex === timeIndex
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-4 bg-gray-50 border-b">
          <button onClick={handlePreviousClass} className="text-gray-600 hover:text-gray-900 text-xl font-bold">
            <FiChevronLeft size={24} />
          </button>
          <h2 className="mx-4 text-xl font-semibold text-black">{classes[currentClassIndex]}</h2>
          <button onClick={handleNextClass} className="text-gray-600 hover:text-gray-900 text-xl font-bold">
            <FiChevronRight size={24} />
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Horário</th>
              {weekDays.map((day, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeSlots.map((timeSlot, timeIndex) => (
              <tr key={timeIndex}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{timeSlot}</td>
                {weekDays.map((_, dayIndex) => {
                  const slotClasses = getClassesForSlot(dayIndex, timeIndex);
                  const hasFixed = slotClasses.some((cls) => cls.isFixed);
                  return (
                    <td key={dayIndex} className="px-4 py-4 text-sm border">
                      {slotClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className={`p-2 rounded mb-1 ${
                            cls.isFixed ? 'bg-green-100 border border-green-200' : 'bg-blue-50 border border-blue-200'
                          }`}
                        >
                          <p className="font-medium text-gray-900">
                            {subjects.find((subject) => subject.id === cls.subjectId)?.name || 'Matéria não encontrada'}
                          </p>
                          <p className="text-gray-800">
                            {teachers.find((teacher) => teacher.id === cls.teacherId)?.name || 'Professor não encontrado'}
                          </p>
                          {cls.isFixed && <p className="text-xs text-green-700 font-semibold">Aula Fixa</p>}
                          <p className="text-xs text-gray-600">
                            {cls.date ? new Date(cls.date).toLocaleDateString('pt-BR') : ''}
                          </p>
                          {!cls.isFixed && (
                            <button
                              onClick={() => handleDeleteClass(cls.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      ))}
                      {!hasFixed && (
                        <button
                          onClick={() => handleAddClass(dayIndex, timeIndex)}
                          className="w-full py-2 border border-dashed border-gray-300 rounded-md text-gray-400 hover:text-gray-500"
                        >
                          + Adicionar aula
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
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClass}
        subjects={subjects}
        teachers={teachers}
        currentWeek={currentWeek.toISOString()}
      />
    </>
  );
}
