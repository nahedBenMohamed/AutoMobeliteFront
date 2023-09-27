import React from "react";
import Image from "next/image";

const Button = ({
  isDisabled,
  btnType,
  containerStyles,
  textStyles,
  title,
  rightIcon,
  handleClick,
}) =>
  React.createElement(
    "button",
    {
      disabled: isDisabled,
      type: btnType || "button",
      className: `custom-btn ${containerStyles}`,
      onClick: handleClick,
    },
    React.createElement("span", { className: `flex-1 ${textStyles}` }, title),
    rightIcon &&
      React.createElement(
        "div",
        { className: "relative w-6 h-6" },
        React.createElement(Image, {
          src: rightIcon,
          alt: "arrow_left",
          fill: true,
          className: "object-contain",
        })
      )
  );

export default Button;
