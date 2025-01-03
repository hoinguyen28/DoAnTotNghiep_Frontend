import React from 'react';
import "./Footer.css";

// Define the types for the props of SocialIcon component
interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const Footer = () => {
  return (
    <div className='footer__bg'>
    <div className="footer__main-container container container--footer">
      <div className="footer__logo-wrapper">
        <img
          src="//society6.com/cdn/shop/files/global-footer-logo-black.svg?v=1712698045&width=298"
          alt=""
          srcSet="//society6.com/cdn/shop/files/global-footer-logo-black.svg?v=1712698045&width=298 298w"
          width="298"
          height="75"
          loading="lazy"
          className="footer__logo-image"
        />
        <div id="footerSocialsDesktop">
          <div className="footer__socials footer__socials--desktop">
            <SocialIcon
              href="https://instagram.com/society6"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" style={{ width: '16px' }}>
                  <path fill="#000" d="M17.708 0H3.542A3.542 3.542 0 0 0 0 3.542v14.166a3.542 3.542 0 0 0 3.542 3.542h14.166a3.542 3.542 0 0 0 3.542-3.542V3.542A3.542 3.542 0 0 0 17.708 0Zm1.771 17.708a1.77 1.77 0 0 1-1.77 1.771H3.541a1.77 1.77 0 0 1-1.771-1.77V3.541A1.77 1.77 0 0 1 3.54 1.77h14.167a1.77 1.77 0 0 1 1.771 1.77v14.167Z" />
                  <path fill="#000" d="M10.625 5.313a5.312 5.312 0 1 0 0 10.624 5.312 5.312 0 0 0 0-10.624Zm0 8.854a3.542 3.542 0 1 1 0-7.085 3.542 3.542 0 0 1 0 7.085ZM16.507 6.072a1.328 1.328 0 1 0 0-2.656 1.328 1.328 0 0 0 0 2.656Z" />
                </svg>
              }
              label="Instagram"
            />
            <SocialIcon
              href="https://www.pinterest.com/society6/"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.22 21.25" style={{ width: '16px' }}>
                  <path fillRule="evenodd" d="M7.19 14.52c.7.02 1.33.91 3.17.91 3.47.02 5.85-2.54 6.6-5.9C19.55-2.12 1.92-3.05.12 6.54c-.43 2.26.27 4.86 2.09 5.71 1.4.65 1.49-1.22 1.06-2.02-1.89-3.56.38-6.77 3.35-7.68 2.79-.87 4.77-.15 6.28 1.35 1.94 1.93 1.06 7.18-1.24 8.85-.81.59-2.3.72-3.06.02-1.58-1.41.86-4.41.5-6.6C8.74 4 5.18 4.33 5 7.52c-.09 1.63.41 2.1.02 3.73-.61 2.6-2.45 7.92-1.15 10 1.91-.87 2.86-6.08 3.31-6.73Z" />
                </svg>
              }
              label="Pinterest"
            />
            <SocialIcon
              href="https://instagram.com/society6"
              icon={
                <svg 
  className="tiktok-icon__svg" 
  xmlns="http://www.w3.org/2000/svg" 
  fill="none" 
  viewBox="0 0 21 21" 
  style={{ width: '16px' }}  
>
  <g clipPath="url(#a)">
    <path fill="#000" d="M14.727.5h-3.37v13.623c0 1.623-1.296 2.957-2.91 2.957-1.613 0-2.91-1.334-2.91-2.957 0-1.594 1.268-2.898 2.824-2.956v-3.42c-3.428.057-6.194 2.869-6.194 6.376 0 3.536 2.823 6.377 6.309 6.377s6.309-2.87 6.309-6.377V7.138a7.805 7.805 0 0 0 4.465 1.507v-3.42C16.715 5.138 14.727 3.05 14.727.5Z"></path>
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M.5.5h20v20H.5z"></path>
    </clipPath>
  </defs>
</svg>

              }
              label="Instagram"
            />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <FooterNav />
    </div>
    <div className="footer__sub container container--footer">

      <div className="footer__sub-colophon d-flex justify-content-center align-items-center mb-4">
        © 2024 Society6, LLC. LG Commerce. Some rights reserved.
      </div>
    </div>
    <img 
  src="//society6.com/cdn/shop/files/global-footer-background-mobile.svg?v=1712698044&amp;width=1500" 
  alt="" 
  srcSet="//society6.com/cdn/shop/files/global-footer-background-mobile.svg?v=1712698044&amp;width=352 352w, //society6.com/cdn/shop/files/global-footer-background-mobile.svg?v=1712698044&amp;width=832 832w, //society6.com/cdn/shop/files/global-footer-background-mobile.svg?v=1712698044&amp;width=1200 1200w, //society6.com/cdn/shop/files/global-footer-background-mobile.svg?v=1712698044&amp;width=1500 1500w" 
  style={{ width: '100%', height: '60px', objectFit: 'cover' }} 
  loading="lazy" 
  className="footer__bottom-edge-background-image hide-desktop" 
/>

    </div>
  );
};

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon, label }) => (
  <a className="footer__socials-icon-wrapper footer__socials-icon-wrapper--desktop" href={href} target="_blank" rel="noreferrer">
    {icon}
    <span className="screenreader">{label}</span>
  </a>
);

const FooterNav = () => (
  <nav className="footer__nav-desktop hide-mobile">
    <div className="footer__nav-desktop-columns mb-5">
      <FooterColumn title="Contact Us" links={[{ text: 'Contact Us', href: 'https://help.society6.com/hc/en-us/requests/new' }]} />
      <FooterColumn title="Customer Support" links={[{ text: 'Help Center', href: 'https://help.society6.com/hc/en-us' }]} />
      <FooterColumn title="About Us" links={[{ text: 'Our Story', href: '/pages/about' }]} />
      <FooterColumn title="Artist Support" links={[{ text: 'Sell Your Art', href: '/pages/sell-art' }]} />
    </div>
  </nav>
);

interface FooterColumnProps {
  title: string;
  links: { text: string; href: string }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <div className="footer__nav-desktop-column">
    <h4 className="footer__nav-desktop-hdg">{title}</h4>
    <ul className="footer__nav-desktop-link-list list-reset">
      {links.map((link, index) => (
        <li key={index} className="footer__nav-desktop-link-item">
          <a className="footer__nav-desktop-link" href={link.href}>
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
