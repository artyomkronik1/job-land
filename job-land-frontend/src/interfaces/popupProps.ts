import {ReactNode} from "react";

export interface PopupProps{
    size?:string;
    onClose:()=>void;
    children?:ReactNode;
}