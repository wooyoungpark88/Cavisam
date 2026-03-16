interface EventThumbnailProps {
  time: string;
  imageUrl?: string;
  label: string;
  onClick?: () => void;
}

export function EventThumbnail({ time, imageUrl, label, onClick }: EventThumbnailProps) {
  return (
    <div
      className="w-[107px] cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-full h-[108px] bg-gray-200 rounded overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              IMAGE
            </div>
          )}
        </div>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[11px] font-bold text-gray-600">
          {time}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gray-500/70 text-white text-center text-[8px] font-bold py-1">
          {label}
        </div>
      </div>
    </div>
  );
}
