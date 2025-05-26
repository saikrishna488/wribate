

const WribateCard = ({ wribate, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white cursor-pointer border hover:shadow-lg transition-shadow w-full"
    >
      <div className="flex flex-row">
        <div className="flex-grow p-3">
          <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-1">{wribate.title}</h3>
          <div className="flex flex-row items-center gap-1 text-xs text-gray-600">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full inline-block w-fit mb-1">{wribate.category}</span>
            {wribate.institution && <span className="text-gray-500 inline-block">{wribate.institution}</span>}
          </div>
        </div>
        <div className="w-24 h-14 my-auto flex-shrink-0 flex items-center">
          <img
            src={wribate.coverImage}
            alt={wribate.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default WribateCard;