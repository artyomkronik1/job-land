import React from "react";

export interface SearchInputFieldProps {
    placeHolder: string;
    value:string;
    ariaLabel:string
    onChange:(event:string)=>void;
}