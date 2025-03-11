import { useState } from 'react';

interface Subject {
  id: number;
  name: string;
}

export default function SubjectManager({ subjects, onAddSubject, onDeleteSubject }: { subjects: Subject[], onAddSubject: (name: string) => void, onDeleteSubject: (id: number) => void }) {

  const [newSubject, setNewSubject] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newSubject.trim()) {
      onAddSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 text-black">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Matérias</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
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
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
          >
            Adicionar
          </button>
        </div>
      </form>
      
      <div className="space-y-2">
        <h3 className="font-medium text-gray-700 mb-2">Matérias Cadastradas</h3>
        {subjects.length === 0 ? (
          <p className="text-gray-500 italic">Nenhuma matéria cadastrada</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {subjects.map(subject => (
              <li key={subject.id} className="py-3 flex justify-between items-center">
                <span>{subject.name}</span>
                <button
                  onClick={() => onDeleteSubject(subject.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
