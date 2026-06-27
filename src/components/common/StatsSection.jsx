import React from 'react';

const StatsSection = () => {
  const stats = [
    { value: '48h', label: 'AVG RESPONSE' },
    { value: '94%', label: 'SATISFACTION' },
    { value: '24/7', label: 'MONITORING' },
    { value: '100%', label: 'TRANSPARENT' }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
