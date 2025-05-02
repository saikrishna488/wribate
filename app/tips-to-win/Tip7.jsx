import React from "react";
const Tip7 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            7. Handling Difficult Counterarguments
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            In wribate, it&apos;s important to address difficult or aggressive
            counterarguments with grace:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Stay Calm and Focused:
              </span>
              <span className="text-gray-700">
                If your opponent&apos;s arguments seem aggressive or unfair,
                focus on the content rather than personal attacks.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Use Logic to Redirect:
              </span>
              <span className="text-gray-700">
                If your opponent tries to derail the discussion, steer the
                conversation back to the key issue with logical reasoning and
                evidence.
              </span>
            </li>
          </ul>
        </div>

        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center ">
          <div className="w-full max-w-md">
            

            <img
              src="/tips/counter.jpeg"
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
export default Tip7;
