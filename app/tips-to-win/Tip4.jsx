import React from "react";
const Tip4 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center items-center">
          <div className="w-full max-w-md">
            

            <img
              src="/tips/impact.jpeg"
              alt="Wribate structure diagram showing affirmative and negative arguments"
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
        </div>
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            4. Mastering Written Delivery
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            How you present your arguments in wribates can be just as impactful
            as the content:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Write Clearly and Concisely:
              </span>
              <span className="text-gray-700">
                Avoid jargon or overly complex language. Aim for clarity and
                precision in every sentence.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Be Persuasive Yet Respectful:
              </span>
              <span className="text-gray-700">
                Balance conviction with courtesy. Persuasive writing is about
                presenting your views confidently while respecting the opinions
                of others.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                {" "}
                Maintain Coherence and Flow:
              </span>
              <span className="text-gray-700">
                Ensure your arguments flow logically from one point to the next,
                creating a seamless narrative that strengthens your case.
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-[4px] my-8  border-b-2 w-[70%] mx-auto border-gray-400"></div>
    </div>
  );
};

export default Tip4;
