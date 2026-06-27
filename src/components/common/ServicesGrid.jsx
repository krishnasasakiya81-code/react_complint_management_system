/*const services = [
  {
    title: "Roads & Infrastructure",
    desc: "Report potholes, broken streetlights, damaged sidewalks, or road obstructions in your area.",
    img: "https://i0.wp.com/indianinfrastructure.com/wp-content/uploads/2024/09/142.jpg?resize=678%2C381&ssl=1",
    icon: <AlertTriangle />,
  },
  {
    title: "Water Supply",
    desc: "Issues with water pressure, pipe leaks, quality concerns, or billing disputes.",
    img: "https://i0.wp.com/indianinfrastructure.com/wp-content/uploads/2021/11/II-56.jpg?resize=678%2C381&ssl=1",
    icon: <Droplet />,
  },
  {
    title: "Electricity & Power",
    desc: "Reporting power outages, hazardous wiring, transformer issues.",
    img: "https://met.com/media/tknc3bvb/importance-of-electricity.jpg?width=1920&v=1dbd157654963b0&rmode=min&format=webp&quality=100",
    icon: <Zap />,
  },
  {
    title: "Sanitation & Waste",
    desc: "Missed garbage collections, overflowing bins, illegal dumping.",
    img: "https://aaasanitationco.com/wp-content/uploads/2024/09/male-janitor-in-uniform-cleans-a-trash-can-in-the-2023-11-27-05-10-22-utc-1200x800.jpg",
    icon: <Trash2 />,
  },
  {
    title: "Public Safety",
    desc: "Report non-emergency safety concerns or hazards in public spaces.",
    img: "https://garamendi.house.gov/sites/evo-subsites/garamendi-evo.house.gov/files/styles/evo_featured_image/public/evo-media-image/5967563_022520-kgo-public-safety-img.jpg?h=c673cd1c&itok=wrzP2LLG",
    icon: <Shield />,
  },
  {
    title: "Others",
    desc: "Any other municipal service requests not covered above.",
    img: "https://www.shutterstock.com/image-vector/janitors-clean-street-city-cleaners-260nw-2659145059.jpg",
    icon: <MoreHorizontal />,
  },
];*/

import { useNavigate } from "react-router-dom";

const ServicesGrid = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Roads & Infrastructure",
      desc: "Report potholes, broken streetlights, damaged sidewalks...",
      img: "https://i0.wp.com/indianinfrastructure.com/wp-content/uploads/2024/09/142.jpg",
    },
    {
      title: "Water Supply",
      desc: "Issues with water pressure, pipe leaks...",
      img: "https://i0.wp.com/indianinfrastructure.com/wp-content/uploads/2021/11/II-56.jpg",
    },
  ];

  const handleSelect = () => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/submit-complaint");
      navigate("/login");
    } else {
      navigate("/submit-complaint");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {services.map((s, index) => (
        <div key={index} className="bg-white shadow rounded p-4">

          <img src={s.img} className="h-40 w-full object-cover mb-2" />

          <h3 className="font-bold">{s.title}</h3>
          <p className="text-gray-600">{s.desc}</p>

          <button
            onClick={handleSelect}
            className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
          >
            Select Category →
          </button>

        </div>
      ))}

    </div>
  );
};

export default ServicesGrid;