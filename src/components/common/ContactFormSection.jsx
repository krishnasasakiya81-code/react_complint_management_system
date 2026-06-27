import { Mail, Phone, MapPin } from "lucide-react";

const ContactFormSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10">

        {/* LEFT FORM */}
        <div className="md:col-span-2 bg-white p-8 rounded-xl border">
          <h2 className="text-xl font-semibold mb-6">Send an Feedback</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              className="border rounded-lg px-4 py-3"
              placeholder="Full Name"
            />
            <input
              className="border rounded-lg px-4 py-3"
              placeholder="Email Address"
            />
          </div>

          <input
            className="border rounded-lg px-4 py-3 w-full mb-4"
            placeholder="Subject"
          />

          <textarea
            className="border rounded-lg px-4 py-3 w-full mb-6 h-32"
            placeholder="Write your message here..."
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
            Send Feedback
          </button>
        </div>

        {/* RIGHT INFO */}
        <div className="space-y-4">

          <div className="rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Office"
              className="h-48 w-full object-cover"
            />
          </div>

          <InfoCard
            icon={<MapPin />}
            title="Office Address"
            text="123 Government Plaza, Capital City, GC 10001"
          />

          <InfoCard
            icon={<Mail />}
            title="Support Email"
            text="support@govtrack.gov"
          />

          <InfoCard
            icon={<Phone />}
            title="Toll-free Helpline"
            text="1-800-GOV-HELP"
            sub="Mon–Fri 8:00 AM – 6:00 PM"
          />
        </div>
      </div>
    </section>
  );
};

const InfoCard = ({ icon, title, text, sub }) => {
  return (
    <div className="flex gap-4 items-start border rounded-xl p-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{text}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
};

export default ContactFormSection;