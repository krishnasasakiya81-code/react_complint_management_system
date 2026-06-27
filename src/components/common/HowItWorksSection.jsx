import { Send, Settings, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-12">
        How it Works
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Send className="text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">1. Report</h3>
          <p className="text-gray-600 text-sm">
            Submit your complaint through our intuitive portal.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Settings className="text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">2. Process</h3>
          <p className="text-gray-600 text-sm">
            Track your complaint as officials review and act.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">3. Resolve</h3>
          <p className="text-gray-600 text-sm">
            Get updates and feedback once resolved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;