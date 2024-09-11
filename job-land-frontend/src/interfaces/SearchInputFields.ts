import React from "react";

export interface SearchInputFieldProps {
    placeHolder: string;
    value: string;
    icon?: string;
    ariaLabel: string
    onChange: (event: string) => void;
}