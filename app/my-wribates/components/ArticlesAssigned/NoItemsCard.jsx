export default function NoItemsCard({ title="", subTitle="", btnText="", onClick=()=>{} }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          {title && <div className="text-gray-500 text-xl mb-4">{title}</div>}

          {subTitle && <p className="text-gray-400 mb-6">{subTitle}</p>}

          {btnText && (
            <button
              onClick={onClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {btnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
