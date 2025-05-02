import React from "react";
const Tip3 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            3. Building Strong Written Arguments
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            To win a Wribate, you must present persuasive arguments:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Clear Structure:
              </span>
              <span className="text-gray-700">
                Start with a clear thesis or claim, followed by supporting
                evidence and explanations. Each paragraph should build on the
                last.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Use Rhetorical Devices:
              </span>
              <span className="text-gray-700">
                Enhance your arguments with analogies, metaphors, or relevant
                anecdotes to make them more relatable and memorable.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                {" "}
                Acknowledge Counterarguments:
              </span>
              <span className="text-gray-700">
                Present the opposing view fairly, then refute it respectfully
                with evidence, showing you've considered multiple perspectives.
              </span>
            </li>
          </ul>
        </div>

        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center ">
          <div className="w-full max-w-md">
           

            <img
              src="/tips/arguments.jpg"
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
export default Tip3;
