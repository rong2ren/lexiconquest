
interface KowaiCardProps {
  kowaiName: string;
  type: 'owned' | 'encountered' | 'egg';
  onClick?: (kowaiName: string) => void;
}

export function KowaiCard({ kowaiName, type, onClick }: KowaiCardProps) {
  const getImageSrc = () => {
    if (type === 'egg') {
      return '/kowai/egg.gif';
    }
    return `/kowai/${kowaiName.toLowerCase()}.png`;
  };

  const getCardStyle = () => {
    switch (type) {
      case 'owned':
        return 'w-full cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out';
      case 'encountered':
        return 'w-full cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out';
      case 'egg':
        return 'w-full cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out';
      default:
        return 'w-full cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out';
    }
  };

  const getImageStyle = () => {
    switch (type) {
      case 'owned':
        return 'w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300';
      case 'encountered':
        return 'w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300';
      case 'egg':
        return 'w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300';
      default:
        return 'w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300';
    }
  };

  const getDisplayName = () => {
    if (type === 'egg') {
      return '???';
    }
    return kowaiName;
  };

  return (
    <div className={getCardStyle()}>
      <div className="relative">
        <img 
          src={getImageSrc()} 
          alt={getDisplayName()}
          className={getImageStyle()}
          onClick={() => onClick?.(kowaiName)}
        />
      </div>
      <div className="mt-3 text-center">
        <p className="text-white text-lg font-semibold capitalize">{getDisplayName()}</p>
      </div>
    </div>
  );
}