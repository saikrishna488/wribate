import React from "react";
const Tip8 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center items-center">
          <div className="w-full max-w-md">
           

            <img
              src="/tips/clarity.png"
              alt="Wribate structure diagram showing affirmative and negative arguments"
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
        </div>
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            8. Refining Your Writing
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            The best Wribaters are always refining their writing skills:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Edit and Revise:
              </span>
              <span className="text-gray-700">
                After writing your wribate, take the time to revise for clarity,
                logic, and flow. Strong wribate is polished writing.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Seek Feedback:
              </span>
              <span className="text-gray-700">
                Share your wribate with thought leaders, mentors or peers for
                constructive feedback. Others' perspectives can help you improve
                your arguments.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                {" "}
                Practice Consistently:
              </span>
              <span className="text-gray-700">
                Regular practice is key. The more you write and refine your
                arguments, the stronger and more persuasive you will become.
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-[4px] my-8  border-b-2 w-[70%] mx-auto border-gray-400"></div>
    </div>
  );
};

export default Tip8;
