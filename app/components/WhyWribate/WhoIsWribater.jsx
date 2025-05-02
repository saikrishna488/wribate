"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function WhoIsWribater() {

  const router = useRouter()
  return (
    <section id="who-is-wribater" className="py-16 border-t md:min-h-screen bg-blue-50">
      <div className="container px-4">
        <h2 className="text-5xl font-bold text-center mb-10 text-slate-800">
          Who is a Wribater?
        </h2>
        
        <Card className="border-0  rounded-lg bg-blue-50 overflow-hidden shadow-none  transition-shadow duration-300">
          <div className="flex flex-col gap-4  md:flex-row-reverse">
            {/* Image on the right */}
            <div className="w-full md:w-1/2 transform transition-transform duration-500">
              <img
                src="/whywribate/wribater.png"
                alt="Passionate Wribater expressing ideas"
                className="h-full w-full object-contain"
              />
            </div>
            
            {/* Text content on the left */}
            <CardContent className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white">
              <p className="text-lg md:text-xl leading-relaxed text-slate-700 mb-6 border-l-4 border-blue-400 pl-4 hover:border-blue-600 transition-colors duration-300">
                To be a Wribater is to be more than just a writer—it's to be a voice that sparks thought, a mind that questions, and a soul that dares to express. It means embracing the power of words to <strong className="text-blue-700">inform, inspire, challenge, and transform.</strong>
              </p>
              
              <div className="space-y-4 text-slate-700">
                <p className="text-lg md:text-xl leading-relaxed text-slate-700 mb-6 border-r-4 border-blue-400 pl-4 hover:border-blue-600 transition-colors duration-300">
                  A Wribater stands at the intersection of curiosity and conviction, using the written word to explore ideas, debate perspectives, and contribute to meaningful conversations.
                </p>
                
                <p className="text-lg md:text-xl leading-relaxed text-slate-700 mb-6 border-l-4 border-blue-400 pl-4 hover:border-blue-600 transition-colors duration-300">
                  Whether you're a student finding your voice, a professional sharing expertise, or simply someone passionate about ideas, being a Wribater means joining a community dedicated to thoughtful expression and respectful dialogue.
                </p>
              </div>
              
              <div className="mt-8 w-full text-center">
                <Button onClick={()=>router.push('/add-wribate')} className="bg-blue-800 rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 px-6 py-2 text-white font-medium">
                  Become a Wribater
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}