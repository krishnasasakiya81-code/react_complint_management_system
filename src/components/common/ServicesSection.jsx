import React from 'react';

const ServicesSection = () => {
  const services = [
    {
      icon: '⚡',
      title: 'Fast Resolution',
      description: 'Automated routing ensures your complaints reach the right department instantly, cutting down administrative delays significantly.'
    },
    {
      icon: '👁',
      title: 'Transparent Tracking',
      description: 'Get real-time updates and view the complete audit trail of your reported issues at every stage from submission to closure.'
    },
    {
      icon: '📋',
      title: 'Direct Feedback',
      description: 'Open communication channels allow you to provide feedback and receive clarifications directly from the officials handling your case.'
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Commitment to Service
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We leverage modern digital tracking to ensure that every citizen's voice is heard and every public service gap is addressed with efficiency.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition">
              <div className="text-5xl mb-4 h-16 flex items-center">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
