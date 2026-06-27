import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleStartFiling = () => {
    const user = localStorage.getItem('currentUser');

    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/submit-complaint');
      navigate('/login');
    } else {
      navigate('/submit-complaint');
    }
  };

  return (
    <section className="bg-blue-600 py-16 md:py-20 rounded-lg mx-4 md:mx-0 my-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to make a difference?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Your reports help us build a better city. Join thousands of citizens already making an impact.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={handleStartFiling}
            className="bg-white text-blue-600 px-8 py-3 rounded font-semibold hover:bg-gray-100 transition inline-block"
          >
            Start Filing
          </button>
          <Link
            to="/map"
            className="border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition inline-block"
          >
            View Map
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
