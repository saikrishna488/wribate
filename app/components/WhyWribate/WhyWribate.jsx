export default function WhyWribateSection() {
  return (
    <section id="why-wribate" className="py-16 border-t bg-blue-50">
      <div className="container mx-auto px-4">


        <div className="flex flex-col md:flex-row-reverse items-start gap-12 max-w-6xl mx-auto">
          {/* Image on the right */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl text-center font-bold mb-8 text-gray-800">Why Wribate</h2>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/whywribate/whywribate.png"
                alt="Why Wribate"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-8 mx-auto w-full text-center">
              <button className="bg-blue-800 rounded-full hover:bg-blue-700 text-white font-medium py-3 px-6  shadow-md hover:shadow-lg transition duration-300">
                Know More
              </button>
            </div>
          </div>

          {/* Text content on the left */}
          <div className="w-full md:w-1/2">
            <div className="space-y-8">
              <div className="bg-white p-4 py-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-xl text-blue-900 ">Develop Critical Thinking:</h3>
                <p className="text-gray-700">
                  <strong>Wribate™</strong> challenges students to analyze complex issues from multiple perspectives, fostering deeper understanding and sharpening their critical thinking skills.
                </p>
                <h3 className="font-semibold text-xl text-blue-900 mt-2">Enhance Writing and Communication:</h3>
                <p className="text-gray-700">
                  Through structured written debates, students learn to craft persuasive arguments, communicate ideas clearly, and express themselves with confidence.
                </p>
                <h3 className="font-semibold text-xl text-blue-900 mt-2">Foster Empathy and Respect:</h3>
                <p className="text-gray-700">
                  By engaging with opposing viewpoints, students develop empathy, learning to respect diverse opinions and communicate with grace.
                </p>
                <h3 className="font-semibold text-xl text-blue-900 mt-2">Prepare for the Future:</h3>
                <p className="text-gray-700">
                  The skills gained through <strong>Wribate™</strong>—critical thinking, research, and persuasive writing—prepare students for academic success and future leadership roles.
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}