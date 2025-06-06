import { Badge } from "../../../components/ui/badge";
const WribateCard = ({ wribate, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow-2xl cursor-pointer border px-2 border-gray-400 hover:shadow-lg transition-shadow w-full"
    >
      <div className="flex flex-row">
        <div className="flex-grow p-3">
          <h3 className="text-base font-medium text-gray-900 line-clamp-4 mb-1">{wribate.title}</h3>
          <div className="flex flex-row items-center gap-1 text-xs text-gray-600">
            <Badge className="bg-blue-200 text-blue-900">{wribate.category}</Badge>
            {wribate.institution && <Badge className="text-white bg-blue-900 text-xs inline-block">{wribate.institution}</Badge>}
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
    </div>
  );
};

export default WribateCard;