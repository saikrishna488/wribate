import { useRouter } from "next/navigation";
import { Badge } from "../../../components/ui/badge";

const ArticleCard = ({ article }) => {
    const router = useRouter();


    const handleClick = async () => {
        const {_id, code} = article
        router.push('/article/'+(code? code : _id))
    }

    return (
        <div
            onClick={handleClick}
            className="bg-white shadow-md cursor-pointer border border-gray-300 px-2 rounded-md  hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group w-full h-28"
        >
            <div className="flex flex-row h-full">
                <div className="flex-grow p-3 flex flex-col justify-between min-w-0">
                    <h3 className=" text-sm font-medium text-gray-900 line-clamp-3 mb-1 leading-tight">
                        {article.title}
                    </h3>
                    <div className="flex flex-row items-center gap-1 text-xs text-gray-600 mt-auto">
                        <Badge className="bg-blue-200 text-blue-900 text-xs">{article.category}</Badge>
                        {article.institution && (
                            <Badge className="text-white bg-blue-900 text-xs inline-block">
                                {article.institution}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="w-24 h-14 my-auto flex-shrink-0 flex items-center">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;