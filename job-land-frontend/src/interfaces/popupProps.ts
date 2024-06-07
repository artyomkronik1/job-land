import {ReactNode} from "react";

export interface PopupProps{
    toClose?:boolean;
    size?:string;
    onClose?:()=>void;
    children?:ReactNode;
}