import { useState, useEffect } from 'react';

export default function InspirationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images = [
    { id: 1, alt: "Inspiration Image 1",src: "/whywribate/Slide4.PNG"},
    { id: 2, alt: "Inspiration Image 2",src: "/whywribate/Slide5.PNG" },
    { id: 3, alt: "Inspiration Image 3",src: "/whywribate/Slide6.PNG" },
    { id: 4, alt: "Inspiration Image 1",src: "/whywribate/Slide7.PNG"},
    { id: 5, alt: "Inspiration Image 2",src: "/whywribate/Slide8.PNG" },
    { id: 6, alt: "Inspiration Image 3",src: "/whywribate/Slide9.PNG" },
  ];
  
  // Auto scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  // Manual navigation
  const goToSlide = (index) => {
    setActiveIndex(index);
  };
  
  return (
    <section id="inspiration" className="sm:w-full sm:min-h-screen py-12 bg-blue-50">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-5xl font-bold text-center mb-8">Inspiration</h2> */}
        
        {/* Carousel container */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-lg shadow-lg">
            {/* Carousel slides */}
            <div className="relative h-48 flex items-center sm:h-80 md:h-96">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel indicators */}
          <div className="flex justify-center mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full focus:outline-none ${
                  index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Previous/Next buttons */}
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow focus:outline-none"
            onClick={() => goToSlide((activeIndex - 1 + images.length) % images.length)}
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow focus:outline-none"
            onClick={() => goToSlide((activeIndex + 1) % images.length)}
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}