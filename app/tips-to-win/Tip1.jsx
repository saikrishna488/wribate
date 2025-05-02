import React from "react";
const Tip1 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            1. Understanding the Structure of Wribate
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            A successful Wribate requires more than just facts—it involves
            strategy, structure, and persuasive writing. Here's the key
            structure to follow:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Opening Statements:
              </span>
              <span className="text-gray-700">
                Introduce your argument clearly and confidently, setting the
                foundation for your position.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Argument Presentation:
              </span>
              <span className="text-gray-700">
                Present well-researched evidence to support your stance, using
                logical reasoning to build a solid case.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">Rebuttal:</span>
              <span className="text-gray-700">
                Counter your opponent's arguments thoughtfully and respectfully,
                addressing their claims with evidence.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Closing Statements:
              </span>
              <span className="text-gray-700">
                Summarize your key points, reinforcing your position and leaving
                a lasting impression.
              </span>
            </li>
          </ul>
        </div>

        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center ">
          <div className="w-full max-w-md">
            
            <img
              src="./tips/structure.jpg"
              alt="Wribate structure diagram showing affirmative and negative arguments"
              className="w-full rounded-lg border border-gray-300 max-h-[300px]"
            />
          </div>
        </div>
      </div>
      <div className="h-[4px] my-8  border-b-2 w-[70%] mx-auto border-gray-400"></div>
    </div>
  );
};
export default Tip1;
