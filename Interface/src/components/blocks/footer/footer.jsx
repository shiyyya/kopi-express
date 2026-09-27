import { Link } from 'react-router';
import './footer.css';
import CrownLogo from '/src/assets/logo/logo.svg?react';
import PinIcon from '/src/assets/icons/location.svg?react';
import PhoneIcon from '/src/assets/icons/contact.svg?react'; 
import MailIcon from '/src/assets/icons/email.svg?react'; 
import ClockIcon from '/src/assets/icons/schedule.svg?react';
import LeafIcon from '/src/assets/icons/leaf.svg?react'; 
const DELIVERY_ZONES = [
  'Siling Bata',
  'Poblacion',
  'Bunsuran',
  'San Roque',
];
const CONTACT_INFO = [
  { icon: PinIcon, text: 'Siling Bata, Pandi, Bulacan' },
  { icon: PhoneIcon, text: '0917-123-4567' },
  { icon: MailIcon, text: 'hello@kopiexpress.ph' },
  { icon: ClockIcon, text: '7:00 AM – 9:00 PM daily' },
];
export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerBrand">
        <CrownLogo className="footerBrandIcon" />
        <div>
          <h2 className="footerBrandName">Kopi Express</h2>
          <p className="footerBrandTagline">Est. January 2023 · Pandi, Bulacan</p>
        </div>
      </div>
      <div className="footerColumns">
        <div className="footerColumn">
          <h3 className="footerColumnTitle">Navigate</h3>
          <nav className="footerNav">
            <a href="/#menu" className="footerNavLink">Menu</a>
            <Link to="/store-locator" className="footerNavLink">Store Locator</Link>
          </nav>
        </div>
        <div className="footerColumn">
          <h3 className="footerColumnTitle">Contact</h3>
          <div className="footerContactList">
            {CONTACT_INFO.map(({ icon: Icon, text }) => (
              <div className="footerContactItem" key={text}>
                <Icon className="footerContactIcon" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footerZones">
        <h3 className="footerColumnTitle">Delivery Zones</h3>
        <div className="footerZonesList">
          {DELIVERY_ZONES.map((zone) => (
            <span className="footerZoneTag" key={zone}>{zone}</span>
          ))}
        </div>
      </div>
      <hr className="footerDivider" />
      <div className="footerBottom">
        <p className="footerCopyright">© 2025 Kopi Express. All rights reserved.</p>
        <p className="footerMotto">
          <LeafIcon className="footerMottoIcon" />
          <span>Good coffee. Good company.</span>
        </p>
      </div>
    </footer>
  );
}