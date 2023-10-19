import React, {ReactNode} from "react";

export interface DropdownProps {
    children: ReactNode;
    options:string[];
    changeDropValue:(value:string)=>void;
}