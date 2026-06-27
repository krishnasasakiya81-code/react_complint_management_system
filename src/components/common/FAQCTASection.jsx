const FAQCTASection = () => {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-blue-600 rounded-2xl text-white p-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">
              Have common questions?
            </h3>
            <p className="text-blue-100">
              Visit our comprehensive knowledge base for instant answers.
            </p>
          </div>

          <button className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium">
            View FAQ →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQCTASection;