import React from 'react'

const AdSection = () => {


    // Ad data
  const ads = [
    {
      src: "/Ads/01.png",
      alt: "Ad 1",
      link: "https://sponsor1.com"
    },
    {
      src: "/Ads/02.png",
      alt: "Ad 2",
      link: "https://sponsor2.com"
    },
    {
      src: "/Ads/03.png",
      alt: "Ad 3",
      link: "https://sponsor3.com"
    }
  ];

    return (
        <div className="mb-8">
            {/* <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-gray-700 pl-3">
              Sponsored
            </h3> */}
            <div className="grid grid-cols-1 gap-4">
                {ads.map((ad, index) => (
                    <a
                        key={index}
                        href={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-gray-200 hover:shadow-md transition-shadow w-full"
                    >
                        <img src={ad.src} alt={ad.alt} className="w-full" />
                    </a>
                ))}
            </div>
        </div>
    )
}

export default AdSection
