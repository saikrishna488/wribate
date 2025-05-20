

const Sidebar = () => {
    return (
        <div className="w-full lg:w-[30%] space-y-4 sm:space-y-6 mt-4 lg:mt-0">
            <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 text-center rounded-sm">
                <div className="mb-2 font-bold uppercase text-[10px] sm:text-xs tracking-wider text-gray-600">Advertisement</div>
                <div className="bg-gray-100 h-48 sm:h-64 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Ad Space</span>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 text-center rounded-sm">
                <div className="mb-2 font-bold uppercase text-[10px] sm:text-xs tracking-wider text-gray-600">Advertisement</div>
                <div className="bg-gray-100 h-48 sm:h-64 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Ad Space</span>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-sm">
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Related Wribates</h3>
                <div className="space-y-3 sm:space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="border-b border-gray-100 pb-2 sm:pb-3 last:border-b-0">
                            <h4 className="font-medium hover:text-blue-600 cursor-pointer text-sm sm:text-base">Sample Related Wribate Topic {item}</h4>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>2 days ago</span>
                                <span>32 comments</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
