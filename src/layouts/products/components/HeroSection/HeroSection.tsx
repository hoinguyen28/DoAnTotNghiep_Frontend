import React from "react";
import PropTypes from "prop-types";
import "./HeroSection.css";

interface HeroSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imgUrl: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  buttonText,
  buttonUrl,
  imgUrl,
}) => {
  return (
    <div
      className="hero"
      style={
        {
          backgroundColor: "rgb(251, 250, 246)",
          "--desktop-title-font-size": "120px",
          "--desktop-title-font-scale": "0.85",
          "--mobile-title-font-scale": "0.78",
        } as React.CSSProperties
      }
    >
      <div className="hero__inner-container hero__inner-container--3d">
  <div className="hero__left-side-wrapper hero__left-side-wrapper--3d">
    <h1 className="hero__title hero__title--3d h2">{title}</h1>
    <div className="hero__content-wrapper">
      <div className="hero__description hero__description--3d">
        {description}
      </div>
      <div className="hero__button-wrapper--mobile-align-center">
        <a
          className="hero__button hero__button--3d btn1 btn--primary"
          href={buttonUrl}
        >
          {buttonText}
        </a>
      </div>
    </div>
  </div>
  <div className="hero__right-side-wrapper hero__right-side-wrapper--3d">
    <div className="hero__carousel-wrapper hero__carousel-wrapper--3d">
      <div className="hero__carousel-image">
        <img
          src={imgUrl}
          alt={title}
          style={{
            width: "100%",
            aspectRatio: "1170 / 1170",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  </div>
</div>

      </div>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
};

export default HeroSection;
