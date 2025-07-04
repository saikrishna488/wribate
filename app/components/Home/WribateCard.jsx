import { Badge } from "../../../components/ui/badge";

const WribateCard = ({ wribate, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md cursor-pointer border border-gray-300 px-2 rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group w-full flex flex-col"
    >
      <div className="flex flex-row flex-1">
        <div className="flex-grow p-3 flex flex-col justify-between min-w-0">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-3 mb-1 leading-tight h-12">
            {wribate.title}
          </h3>
          <div className="flex flex-row items-center gap-1 text-xs text-gray-600 mt-auto h-6">
            <Badge className="bg-blue-200 text-blue-900 text-xs">{wribate.category}</Badge>
            {wribate.institution && (
              <Badge className="text-white bg-blue-900 text-xs inline-block">
                {wribate.institution}
              </Badge>
            )}
          </div>
        </div>
        <div className="w-24 h-14 my-auto flex-shrink-0 flex items-center">
          <img
            src={wribate.coverImage}
            alt={wribate.title}
            className="w-full h-full object-fill rounded-md"
          />
        </div>
      </div>
      {(wribate.leadFor || wribate.leadAgainst) && (
        <div className="flex flex-row justify-between gap-2 items-center text-xs text-gray-500 px-3 pb-2 h-6">
          <span title={wribate.leadFor} className="truncate text-red-600">
            {wribate.leadFor}
          </span>
          <span className="text-gray-400">vs</span>
          <span title={wribate.leadAgainst} className="truncate text-blue-600">
            {wribate.leadAgainst}
          </span>
        </div>
      )}
    </div>
  );
};

export default WribateCard;