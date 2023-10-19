import React from "react";

export interface DropdownProps {
    options:string[];
    changeDropValue:(value:string)=>void;
}