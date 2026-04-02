import React from 'react';
const imgAddUser = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/add_user.svg"));
const imgArrowRight = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/arrow_right.svg"));
const imgBookScript = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/book_script.svg"));
const imgClose = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/close.svg"));

type IconProps = React.ImgHTMLAttributes<HTMLImageElement>;
export const Icons = {
  AddUser: (props: IconProps) => (
    <img src={imgAddUser} alt={props.alt ?? ""} {...props} />
  ),
  ArrowRight: (props: IconProps) => (
    <img src={imgArrowRight} alt={props.alt ?? ""} {...props} />
  ),
  BookScript: (props: IconProps) => (
    <img src={imgBookScript} alt={props.alt ?? ""} {...props} />
  ),
  Close: (props: IconProps) => (
    <img src={imgClose} alt={props.alt ?? ""} {...props} />
  ),
};
