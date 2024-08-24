import { ReactNode } from "react";

export interface PopupProps {
    toClose?: boolean;
    size?: string;
    popupTitle: string;
    width: string;
    onClose: () => void;
    children?: ReactNode;
}