const NavigationLinks = ({ links }) => {
  return (
    <nav className="flex flex-col md:flex-row md:space-x-8">
      {links.map((link, index) => (
        <button
          key={index}
          className="text-gray-700 hover:text-pink-600 font-medium py-2 md:py-0"
          onClick={link.action}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
};

export default NavigationLinks;
