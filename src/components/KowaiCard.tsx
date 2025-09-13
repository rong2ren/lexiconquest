
interface Kowai {
  id: string;
  name: string;
}

interface KowaiCardProps {
  kowai: Kowai;
  onClick?: (kowai: Kowai) => void;
}

export function KowaiCard({ kowai, onClick }: KowaiCardProps) {
  return (
    <div className="w-full cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
      <div className="relative">
        <img 
          src={`/kowai/${kowai.name.toLowerCase()}.png`} 
          alt={kowai.name}
          className="w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          onClick={() => onClick?.(kowai)}
        />
      </div>
      <div className="mt-3 text-center">
        <p className="text-white text-lg font-semibold capitalize">{kowai.name}</p>
      </div>
    </div>
  );
}