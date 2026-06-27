import React from 'react';

import HeroSection from '../components/common/HeroSection';
import StatsSection from '../components/common/StatsSection';
import ServicesSection from '../components/common/ServicesSection';
import CTASection from '../components/common/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <div className="max-w-7xl mx-auto w-full px-4">
          <ServicesSection />
          <CTASection />
        </div>
      </main>
    
    </div>
  );
};

export default Home;
