import { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { NavbarContext } from "../../context/navbar/navbar.provider";
import { getMenu } from "../../GraphQl";
import { getUpdatedActiveMenuItemState } from "../../context/navbar/navbar.utils";
import NavLink from "./navlink";

const Navbar = () => {
  const { data, isLoading } = useQuery("menu", getMenu);

  const {
    portfolioDivRef,
    setActiveMenuItem,
    activeMenuItem,
    navbarActive,
    setNavbarActive,
  } = useContext(NavbarContext);


  if(isLoading) return <div>...loading</div>;

  //display active menu item
  const showSection = (title, index) => {
    setNavbarActive((prev) => !prev);
    setActiveMenuItem((prev) => getUpdatedActiveMenuItemState(prev, title));

    //if home is clicked (for mobile)
    if (index === 0) {
      window.scrollTo(0, 0);
      portfolioDivRef.current.scrollTo(0, 0);
    }
    
    return;
  };

  const activeNavLink = (title) =>  activeMenuItem[title] ? true : false;

  return (
    <StyledWrapper>
      <div
        className={`hamburger ${navbarActive && "activeBg"}`}
        onClick={() => setNavbarActive(!navbarActive)}
      >
        <span className="line"></span>
      </div>
      <div className={`menu ${navbarActive ? "active" : ''}`}>
        <ul>
          { data[0].node.links.map(({ title, url, iconClass }, index) => (
            <NavLink
              key={index}
              title={title}
              url={url}
              icon={iconClass}
              index={index}
              showSection={showSection}
              activeNavLink={activeNavLink}
            />
          ))}
        </ul>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.header`
  display: none;
  position: fixed;
  width: 72px;
  top: 2px;
  right: 2px;
  z-index: 3;

  @media (min-width: 681px) {
    position: relative;
    top: 0;
    left: 0;
    margin: 15px 0;
  }

  @media (min-width: 1121px) {
    display: block;
    margin: 36px 0;
  }

  .hamburger {
    position: relative;
    background: transparent;
    display: block;
    width: 100%;
    height: 72px;
    text-align: center;
    z-index: 2;
    transition: background 0.3s ease-out;
    border-radius: 4px 4px 0 0;

    @media (min-width: 681px) {
      background: #fff;
      border-left: 0;
    }

    .line {
      margin-left: -13px;
      margin-top: -1px;
      position: absolute;
      left: 50%;
      top: 50%;
      display: block;
      width: 26px;
      height: 2px;
      background: #323232;

      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: -7px;
        width: 80%;
        height: 100%;
        background: #323232;
      }

      &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -7px;
        width: 60%;
        height: 100%;
        background: #323232;
      }
    }
  }

  .menu {
    opacity: 0;
    position: relative;
    transform: translateY(-120%);
    border-left: solid #f2f2f2fa 0.5px;
    width: 100%;
    border-radius: 0 0 0 6px;
    transition: transform 0.4s ease-in-out, opacity 0.2s ease-in-out;

    @media (min-width: 681px) {
      border-left: 0;
      opacity: 1;
      transform: translateY(0);
    }

    ul {
      background: #fff;
      border-radius: 0 0 5px 5px;
    }
  }

  .active {
    opacity: 1;
    transform: translateY(0);
  }

  .activeBg {
    background: #fff;
    border-left: solid #f2f2f2fa 0.5px;

    @media (min-width: 681px) {
      border-left: 0;
      border-top: 0;
    }
  }
`;

export default Navbar;
