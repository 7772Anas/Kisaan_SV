import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-kisaan-green-darkest to-kisaan-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About Us Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-kisaan-yellow-light">About Us</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="mr-2">📧</span>
                <a href="mailto:7772anas@gmail.com" className="hover:text-kisaan-yellow-light transition-colors duration-300">
                  7772anas@gmail.com
                </a>
              </p>
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                <a href="tel:+91741560341" className="hover:text-kisaan-yellow-light transition-colors duration-300">
                  +91 741560341
                </a>
              </p>
            </div>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-kisaan-yellow-light">Legal</h3>
            <div className="space-y-2">
              <a href="/terms" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Terms & Conditions</a>
              <a href="/privacy" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Privacy Policy</a>
              <a href="/disclaimer" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Disclaimer</a>
            </div>
          </div>

          {/* Requirements Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-kisaan-yellow-light">Requirements</h3>
            <div className="space-y-2">
              <a href="/process" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Process</a>
              <a href="/requirements" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Requirements</a>
              <a href="/registration-help" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Help for Registration</a>
              <a href="/eligibility" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Eligibility</a>
            </div>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-kisaan-yellow-light">Help</h3>
            <div className="space-y-2">
              <a href="/faq" className="block hover:text-kisaan-yellow-light transition-colors duration-300">FAQ</a>
              <a href="/help-center" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Help Center</a>
              <a href="/support" className="block hover:text-kisaan-yellow-light transition-colors duration-300">Customer Support</a>
            </div>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-8">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://github.com/7772Anas" target="_blank" rel="noopener noreferrer" className="hover:text-kisaan-yellow-light transition-colors duration-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/anas-8414612b0/" target="_blank" rel="noopener noreferrer" className="hover:text-kisaan-yellow-light transition-colors duration-300">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
          <p className="text-center text-kisaan-yellow-lightest text-sm">
            © Kisaan Suvidha 2025 — A Green Step Initiative
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
