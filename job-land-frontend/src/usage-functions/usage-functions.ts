import { useEffect } from "react";
// click outside of dialog to close it
export const handleClickOutside = (dialogRef:any, event: MouseEvent, closeDialog: () => void) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        closeDialog();
    }
};
