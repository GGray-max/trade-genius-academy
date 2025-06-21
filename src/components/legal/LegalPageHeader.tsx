interface LegalPageHeaderProps {
  title: string;
}

const LegalPageHeader = ({ title }: LegalPageHeaderProps) => {
  return (
    <div className="hero-gradient text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{title}</h1>
          <p className="text-xl text-gray-200 mt-4 opacity-90">Last Updated: May 21, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default LegalPageHeader;
