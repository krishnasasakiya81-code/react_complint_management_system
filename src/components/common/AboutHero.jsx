const AboutHero = () => {
  return (
    <section
      className="h-[420px] bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(https://images.pond5.com/team-indian-office-employees-discussing-088720859_prevstill.jpeg)",
      }}
    >
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Empowering Citizens through Transparency
          </h1>
          <p className="text-lg text-gray-200">
            Discover how GovTrack bridges the communication gap between public
            administration and the community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;