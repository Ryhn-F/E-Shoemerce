import Image from "next/image";
import { FooterProps } from "./types";

export default function Footer({ className = "" }: FooterProps) {
  const footerSections = [
    {
      title: "Featured",
      links: [
        { label: "Air Force 1", href: "/featured/air-force-1" },
        { label: "Huarache", href: "/featured/huarache" },
        { label: "Air Max 90", href: "/featured/air-max-90" },
        { label: "Air Max 95", href: "/featured/air-max-95" },
      ],
    },
    {
      title: "Shoes",
      links: [
        { label: "All Shoes", href: "/shoes" },
        { label: "Custom Shoes", href: "/shoes/custom" },
        { label: "Jordan Shoes", href: "/shoes/jordan" },
        { label: "Running Shoes", href: "/shoes/running" },
      ],
    },
    {
      title: "Clothing",
      links: [
        { label: "All Clothing", href: "/clothing" },
        { label: "Modest Wear", href: "/clothing/modest" },
        { label: "Hoodies & Pullovers", href: "/clothing/hoodies" },
        { label: "Shirts & Tops", href: "/clothing/shirts" },
      ],
    },
    {
      title: "Kids'",
      links: [
        { label: "Infant & Toddler Shoes", href: "/kids/infant-toddler" },
        { label: "Kids' Shoes", href: "/kids/shoes" },
        { label: "Kids' Jordan Shoes", href: "/kids/jordan" },
        { label: "Kids' Basketball Shoes", href: "/kids/basketball" },
      ],
    },
  ];

  const socialLinks = [
    {
      platform: "x" as const,
      href: "https://twitter.com/nike",
      icon: "/x.svg",
    },
    {
      platform: "facebook" as const,
      href: "https://facebook.com/nike",
      icon: "/facebook.svg",
    },
    {
      platform: "instagram" as const,
      href: "https://instagram.com/nike",
      icon: "/instagram.svg",
    },
  ];

  const legalLinks = [
    { label: "Guides", href: "/guides" },
    { label: "Terms of Sale", href: "/terms-of-sale" },
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Nike Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <footer
      className={`bg-dark-900 text-light-100 ${className}`}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Social */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/logo.svg"
                alt="Nike"
                width={60}
                height={22}
                className="h-6 w-auto filter invert"
              />
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  className="text-light-100 hover:text-light-300 transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-light-100 focus:ring-offset-2 focus:ring-offset-dark-900"
                  aria-label={`Follow us on ${social.platform}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={social.icon}
                    alt={`${social.platform} icon`}
                    width={20}
                    height={20}
                    className="filter invert"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-light-100 text-body-medium font-medium mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-light-300 hover:text-light-100 text-body transition-colors duration-200 focus:outline-none focus:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-light-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979.236.393.264.78.264 1.021 0 .24-.028.628-.264 1.021C10.792 9.807 10.304 10 10 10c-.304 0-.792-.193-1.264-.979C8.5 8.628 8.472 8.24 8.472 8c0-.24.028-.628.264-1.021zM10 12a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-light-300 text-caption">
                Croatia © {new Date().getFullYear()} Nike, Inc. All Rights
                Reserved
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link, index) => (
                <span key={link.label} className="flex items-center">
                  <a
                    href={link.href}
                    className="text-light-300 hover:text-light-100 text-caption transition-colors duration-200 focus:outline-none focus:underline"
                  >
                    {link.label}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-light-500 mx-2">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
