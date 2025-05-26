// Section Header with "View more" link
import { HiOutlineArrowRight } from 'react-icons/hi';
const SectionHeader = ({ title, borderColor, viewMoreLink, onViewMore }) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className={`text-xl font-bold text-gray-900 border-l-4 ${borderColor} pl-3`}>
        {title}
      </h2>
      <button
        onClick={onViewMore}
        className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
      >
        View more <HiOutlineArrowRight className="ml-1" />
      </button>
    </div>
  );
};

export default SectionHeader;