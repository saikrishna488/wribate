import React from "react";
const Tip6 = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/5 mt-6 lg:mt-0 flex justify-center items-center">
          <div className="w-full max-w-md">
           

            <img
              src="/tips/persuasive.jpg"
              alt="Wribate structure diagram showing affirmative and negative arguments"
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
        </div>
        <div className="lg:w-3/5 pr-0 lg:pr-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            6. Using Persuasive Writing Techniques
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-6">
            Great wribate isn't just about presenting facts—it&apos;s about
            persuading your reader:
          </p>

          <ul className="space-y-4 mb-6 list-disc md:ml-6 md:mr-6">
            <li>
              <span className="font-bold text-gray-800 mr-2">
                Tell Stories:
              </span>
              <span className="text-gray-700">
                Incorporating relatable stories or real-life examples can make
                your argument more compelling and memorable.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                Use Analogies:
              </span>
              <span className="text-gray-700">
                Simplify complex ideas by relating them to familiar concepts or
                situations.
              </span>
            </li>

            <li>
              <span className="font-bold text-gray-800 mr-2">
                {" "}
                Appeal to Emotion:
              </span>
              <span className="text-gray-700">
                While logic is key, don't hesitate to appeal to your reader's
                emotions to make your argument more relatable and impactful.
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-[4px] my-8  border-b-2 w-[70%] mx-auto border-gray-400"></div>
    </div>
  );
};

export default Tip6;
