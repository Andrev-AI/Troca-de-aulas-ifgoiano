interface HeaderProps {
  title: string;
  showManage?: boolean;
  onManageClick?: () => void;
  onBackClick?: () => void;
}

export default function Header({ title, showManage = true, onManageClick, onBackClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div>
          {showManage ? (
            <button 
              onClick={onManageClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Gerenciar
            </button>
          ) : (
            <button 
              onClick={onBackClick}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Voltar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}