import { Link } from "react-router";
import { FaFacebook, FaCcStripe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
        <div>
          <h2 className="text-2xl font-bold text-white">TicketBari</h2>
          <p className="mt-3 text-sm">
            Book bus, train, launch & flight tickets easily.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/all-tickets" className="hover:text-white">All Tickets</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Info</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@ticketbari.com</li>
            <li>Phone: +880 1234-567890</li>
            <li className="flex items-center gap-2">
              <FaFacebook /> Facebook Page
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Payment Methods</h3>
          <div className="flex items-center gap-3 text-3xl">
            <FaCcStripe />
          </div>
          <p className="text-sm mt-2">Secure payments powered by Stripe</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm">
        © 2025 TicketBari. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
