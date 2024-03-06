import {ReactNode} from "react";

export interface warningProps{
    isOpen:boolean;
    onClose:()=>void;
    children?:ReactNode;
    onConfirm:()=>void;
    onCancel:()=>void;
    warningText:string;
}