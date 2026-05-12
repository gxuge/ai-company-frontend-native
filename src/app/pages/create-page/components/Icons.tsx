import React from 'react';
import { Image } from 'react-native';
const imgAddUser = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/add_user.svg"));
const imgArrowRight = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/arrow_right.svg"));
const imgBookScript = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/book_script.svg"));
const imgClose = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-page/close.svg"));

type IconProps = React.ImgHTMLAttributes<HTMLImageElement>;
export const Icons = {
  AddUser: (props: IconProps) => (
    // @ts-expect-error
    <Image source={imgAddUser} alt={props.alt ?? ""} {...props} />
  ),
  ArrowRight: (props: IconProps) => (
    // @ts-expect-error
    <Image source={imgArrowRight} alt={props.alt ?? ""} {...props} />
  ),
  BookScript: (props: IconProps) => (
    // @ts-expect-error
    <Image source={imgBookScript} alt={props.alt ?? ""} {...props} />
  ),
  Close: (props: IconProps) => (
    // @ts-expect-error
    <Image source={imgClose} alt={props.alt ?? ""} {...props} />
  ),
};
