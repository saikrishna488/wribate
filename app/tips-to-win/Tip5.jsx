import React from "react";
const Tip5 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            5.Crafting Effective Rebuttalss
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            A strong rebuttal can make or break a Wribate:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Listen and Analyze:
              </span>
              <span className="text-gray-700">
                Carefully read and understand your opponent&apos;s arguments.
                Identify weaknesses or logical flaws you can address.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Stay Focused and Respectful:
              </span>
              <span className="text-gray-700">
                While it&apos;s tempting to challenge your opponent harshly,
                always keep your rebuttals focused on the argument, not the
                person.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                {" "}
                Use Evidence:
              </span>
              <span className="text-gray-700">
                Base your rebuttals on solid, fact-checked evidence, and make
                sure they directly address the opponent&apos;s claims.
              </span>
            </li>
          </ul>
        </div>

        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center ">
          <div className="w-full max-w-md">
          

            <img
              src="/tips/rebuttal.jpg"
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
export default Tip5;
