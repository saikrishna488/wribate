import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function WribateForStudents() {

  const router = useRouter();
  return (
    <section id="wribate-for-students" className="py-16 md:min-h-screen border-t bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-10 text-slate-800">
          Wribate for Students
        </h2>
        
        <Card className=" overflow-hidden border-0">
          <div className="flex flex-col md:flex-row">
            {/* Image on the left */}
            <div className="w-full md:w-2/5 ">
              <img
                src="/whywribate/students.png"
                alt="Students engaged in written debate"
                className="h-full w-full object-contain"
              />
            </div>
            
            {/* Text content on the right */}
            <CardContent className="w-full md:w-3/5 p-6 md:p-10 border-none flex flex-col justify-center bg-white">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-blue-900">
                Empowering the Next Generation of Thinkers
              </h3>
              
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  In a rapidly changing world, the ability to think critically, communicate effectively, and argue persuasively is more important than ever. At <strong className="text-blue-900 font-bold">Wribate™</strong>, we provide students with the tools and opportunities to hone these essential skills through written debate.
                </p>
                
                <p className="leading-relaxed">
                  Our platform offers a safe space for students to express ideas, challenge assumptions, and develop confidence in their writing abilities.
                </p>
                
                <p className="leading-relaxed">
                  Whether you're a student looking to sharpen your communication, an educator wanting to inspire critical thinking, or a parent seeking to nurture your child's intellectual growth, <strong className="text-blue-900 font-bold">Wribate™</strong> is here to guide you every step of the way.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={()=>router.push('/propose-wribate')} className="bg-blue-800 rounded-full  shadow-md hover:bg-purple-800 transition-all duration-300 px-6 py-2 text-white font-medium">
                  Start Wribating
                </Button>
                <Button onClick={()=>router.push('/tips-to-win')} variant="outline" className="border-blue-800 rounded-full text-blue-600 hover:bg-purple-800 hover:text-white  shadow-md hover:shadow-lg transition-all duration-300 px-6 py-2 font-medium">
                  Tips for Winning
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}