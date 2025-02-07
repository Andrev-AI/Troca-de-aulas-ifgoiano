import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { ChevronLeft, ChevronRight, Settings, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from './components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';

const Main = () => {
  const [currentClass, setCurrentClass] = useState(0);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteExchangeId, setDeleteExchangeId] = useState(null);
  const [subjects, setSubjects] = useState(["Matemática", "Português", "Física", "Literatura"]);
  const [teachers, setTeachers] = useState([
    { id: 1, name: "João Silva", subjects: ["Matemática", "Física"] },
    { id: 2, name: "Maria Santos", subjects: ["Português", "Literatura"] },
  ]);
  const [exchangeForm, setExchangeForm] = useState({ subject: "", teacher: "", date: "" });
  const [exchanges, setExchanges] = useState([]);

  const classes = ["Turma A", "Turma B", "Turma C"];
  const timeSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"];
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  const handleSlotClick = (dayIndex, timeIndex) => {
    setSelectedSlot({ day: dayIndex, time: timeIndex });
    setShowExchangeModal(true);
  };

  const handleExchangeDelete = (exchangeId) => {
    setDeleteExchangeId(exchangeId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setExchanges(exchanges.filter(ex => ex.id !== deleteExchangeId));
    setShowDeleteConfirm(false);
  };

  const confirmExchange = () => {
    if (!exchangeForm.subject || !exchangeForm.teacher || !exchangeForm.date) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const hasConflict = exchanges.some(ex => 
      ex.day === selectedSlot.day &&
      ex.time === selectedSlot.time &&
      ex.date === exchangeForm.date
    );

    if (hasConflict) {
      alert('Já existe uma troca agendada para esta data neste horário');
      return;
    }

    const newExchange = {
      id: Date.now(),
      ...selectedSlot,
      ...exchangeForm
    };

    setExchanges([...exchanges, newExchange]);
    setShowExchangeModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentClass(prev => Math.max(0, prev - 1))}
              disabled={currentClass === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">{classes[currentClass]}</h2>
            <Button
              variant="outline"
              onClick={() => setCurrentClass(prev => Math.min(classes.length - 1, prev + 1))}
              disabled={currentClass === classes.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Link to="/gerenciar">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </Link>
        </div>

        {/* Grade de Horários */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-r bg-gray-50">Horário</th>
                {days.map(day => (
                  <th key={day} className="p-4 border-b bg-gray-50">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIndex) => (
                <tr key={time}>
                  <td className="p-4 border-r font-medium text-sm">{time}</td>
                  {days.map((_, dayIndex) => {
                    const currentExchanges = exchanges.filter(
                      ex => ex.day === dayIndex && ex.time === timeIndex
                    );
                    
                    return (
                      <td key={dayIndex} className="p-4 border relative min-h-[100px]">
                        <div className="space-y-2">
                          {currentExchanges.length > 0 ? (
                            currentExchanges
                              .sort((a, b) => new Date(a.date) - new Date(b.date))
                              .map(exchange => (
                                <div 
                                  key={exchange.id} 
                                  className="bg-blue-50 p-2 rounded-md relative group hover:shadow-md transition-shadow"
                                >
                                  <div className="text-sm font-medium">{exchange.subject}</div>
                                  <div className="text-sm text-gray-600">{exchange.teacher}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(exchange.date).toLocaleDateString('pt-BR')}
                                  </div>
                                  <button
                                    onClick={() => handleExchangeDelete(exchange.id)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </button>
                                </div>
                              ))
                          ) : null}
                          <button
                            onClick={() => handleSlotClick(dayIndex, timeIndex)}
                            className="w-full h-12 rounded border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center"
                          >
                            <span className="text-sm text-gray-500">
                              {currentExchanges.length === 0 ? 'Horário Vago' : 'Adicionar Troca'}
                            </span>
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Troca */}
        <Dialog open={showExchangeModal} onOpenChange={setShowExchangeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Troca de Horário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Matéria</label>
                <Select onValueChange={(value) => setExchangeForm(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a matéria" />
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Professor</label>
                <Select onValueChange={(value) => setExchangeForm(prev => ({ ...prev, teacher: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers
                      .filter(teacher => teacher.subjects.includes(exchangeForm.subject))
                      .map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.name}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  onChange={(e) => setExchangeForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExchangeModal(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmExchange}>
                Confirmar Troca
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmação de Exclusão */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta troca de horário?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Main;