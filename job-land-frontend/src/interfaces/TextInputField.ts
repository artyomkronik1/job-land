import React from "react";

export interface TextInputFieldProps {
    type: string;
    placeHolder: string;
    text: string;
    value:any;
    onChange:(event:string)=>void;
}