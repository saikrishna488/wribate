"use client"

import { ArrowRightIcon, BookOpenIcon, Lightbulb, GraduationCap, UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Welcome from './Welcome';
import WhatIsWribateSection from './WhatIsWribate';
// import { Inspiration } from 'next/font/google';
import InspirationCarousel from './Inspiration';
import WribateForYou from './WribateForYou';
import WhyWribateSection from './WhyWribate';
import WribateForStudents from './WribateForStudents';
import WhoIsWribater from './WhoIsWribater';
import WribateVsDebate from './WribateVsDebate';

export default function Mainsection() {
    const router = useRouter();
    return (
        <div className="flex w-full overflow-y-auto bg-gray-50">
            <main className="flex-1 p-2 sm:p-0  w-full">
                {/* Hero Section */}
                <Welcome/>

                {/* What is Wribate */}
                <WhatIsWribateSection/>

                {/* Inspiration */}
                <InspirationCarousel/>

                {/* Wribate for You */}
                <WribateForYou/>

                {/* Why Wribate */}
                <WhyWribateSection/>

                {/* Wribate for Students */}
                <WribateForStudents/>

                {/* Who is a Wribater */}
                <WhoIsWribater/>

                {/* Wribate vs Debate */}
                <WribateVsDebate/>

            </main>
        </div>
    );
}