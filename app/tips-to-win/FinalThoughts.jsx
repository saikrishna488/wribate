export default function FinalThoughts() {
  return (
    <div className="bg-white md:p-8 p-2">
      <div className="flex justify-center ">
        <div className="text-center">
          <div className=" mx-auto relative mb-2">
            <div className="">
              <div className="w-full flex items-center justify-center">
                {/* <div className="w-16 h-16 border-2 border-indigo-900 rounded-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-900">W</span>
                </div> */}
                <img src="/logo.jpeg" height={80} width={100} />
              </div>
            </div>
            {/* <div className="absolute inset-0">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-indigo-900 rounded-full"></div>
              </div>
            </div>
            <div className="absolute -top-1 -left-1 w-26 h-26">
              <div className="w-6 h-12 border-l-2 border-indigo-900 absolute top-2 left-6 transform -rotate-45"></div>
              <div className="w-6 h-12 border-l-2 border-indigo-900 absolute top-2 right-6 transform rotate-45"></div>
              <div className="w-6 h-12 border-l-2 border-indigo-900 absolute bottom-2 left-6 transform rotate-45"></div>
              <div className="w-6 h-12 border-l-2 border-indigo-900 absolute bottom-2 right-6 transform -rotate-45"></div>
            </div> */}
          </div>
          <h2 className="text-xl font-bold text-indigo-900">Wribate</h2>
          <p className="text-sm text-indigo-900 italic">Write to Win</p>
        </div>
      </div>

      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Final Thoughts
        </h1>

        <p className="text-lg text-gray-800 mb-8">
          Mastering the art of Wribate involves not just presenting facts, but
          constructing logical, persuasive arguments and delivering them clearly
          and respectfully. By honing your research, writing, and rebuttal
          skills, you can become an effective and compelling writer and leader
          for any situation.
        </p>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Start Your Journey
          </h3>
          <p className="text-lg text-gray-800">
            Visit <span className="font-bold">Wribate.com</span> today to access
            valuable resources, tools, and tips that will help you become a
            skilled and confident Wribater. With practice and preparation,
            you'll master the art of persuasive written communication and make
            your arguments stand out.
          </p>
        </div>

        <div className="mt-12">
          <p className="text-lg font-medium text-gray-800">To your success,</p>
          <p className="text-lg font-bold text-gray-900">The Wribate Team</p>
        </div>
      </div>
    </div>
  );
}
