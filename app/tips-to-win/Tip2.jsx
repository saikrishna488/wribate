import React from "react";
const Tip2 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center items-center">
          <div className="w-full max-w-md">

            <img
              src="/tips/research.webp"
              alt="Wribate structure diagram showing affirmative and negative arguments"
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
        </div>
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            2. Persuasive
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            Preparation is key to crafting compelling written arguments:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Know Your Topic:
              </span>
              <span className="text-gray-700">
                Dive deep into your subject matter. Gather credible sources,
                facts, and perspectives to support your case.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Understand Opposing Viewpoints:
              </span>
              <span className="text-gray-700">
                Research your opponent’s likely arguments and prepare
                well-supported rebuttals.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                {" "}
                Outline Your Ideas:
              </span>
              <span className="text-gray-700">
                Organize your thoughts in a clear outline before writing. This
                will help structure your argument logically and avoid
                unnecessary digressions.
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-[4px] my-8  border-b-2 w-[70%] mx-auto border-gray-400"></div>
    </div>
  );
};

export default Tip2;
