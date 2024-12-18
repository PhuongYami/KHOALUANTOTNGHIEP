const HamburgerMenu = ({ isOpen, toggleMenu, links }) => (
    <div>
      <button
        className="block md:hidden text-gray-700"
        onClick={toggleMenu}
      >
        ☰
      </button>
      {isOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-md p-4 space-y-2">
          {links.map((link) => (
            <button
              key={link.path}
              className="block w-full text-left text-gray-700 hover:text-pink-600"
              onClick={link.action}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
  
  export default HamburgerMenu;
  