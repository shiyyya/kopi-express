import './home-header.css';

import Button from '/src/components/elements/button/button.jsx'; 

import MenuIcon from '/src/assets/icons/burger.svg?react';

import CartIcon from '/src/assets/icons/cart.svg?react';

import AvatarIcon from '/src/assets/icons/avatar.svg?react';

import CrownIcon from '/src/assets/logo/logo.svg?react';

export default function HomeHeader({
  currentUser,
  onLogin,
  onCartClick,
  onProfileClick,
  onMenuClick,
  cartCount,
}) {

  return (
    <header className="homeHeader">

      <div className="logo">
        <CrownIcon className="logoIcon" />
        <h1 className="homeTitle">Kopi Express</h1>
      </div>

      <div className="headerActions">

        {currentUser ? (
          <Button
            className="avatarBtn"
            onClick={onProfileClick}
            aria-label="Open profile"
          >
            <AvatarIcon className="avatarIcon" />
          </Button>
        ) : (
          <Button className="headerLoginBtn" onClick={onLogin}>
            Log In
          </Button>
        )}

        <Button
          className="cartBtn"
          onClick={onCartClick}
          aria-label="Open cart"
        >
          <CartIcon className="cartIcon" />

          {cartCount > 0 && (
            <span className="cartCount">
              {cartCount}
            </span>
          )}
        </Button>

        <Button
          className="menuBtn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <MenuIcon className="menuIcon" />
        </Button>

      </div>

    </header>
  );
}