import React, {useEffect, useRef, useState} from 'react';
import styles from './dropdown.module.scss'
import {DropdownProps} from "../../interfaces/DropdownProps";
import JobFilterBtn from "../job-filter-btn/job-filter-btn";
import {useTranslation} from "react-i18next";

const DropDown = (props:DropdownProps)=> {
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [openDrop, setopenDrop] = useState(false);
    const [value, setvalue] = useState('');
    // listening when user click outside of dropdown so close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { 
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setopenDrop(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const dropDownOptions=    props.options.map((value, index)=>(
        <div  style={{display:'flex', alignItems:'center', justifyContent:'center'}} className={styles.dropdownOption}>
            {props.icons?(
                <i className={`${props.icons[index]}`}></i>
            ):(null)}

            <li  key={index} onClick={()=>props.changeDropValue(value)} >{t(value)}</li>
        </div>
    ))
    return(
        <div ref={dropdownRef} style={{  display:'flex', alignItems:'center', gap:'10px', justifyContent:'center'}}  onClick={()=>setopenDrop(!openDrop)}>
            <i style={{color: '#a9acb1', 'fontSize':'25px'}} className={`fa fa-caret-${openDrop ? 'up' : 'down'}`}   ></i>
            {openDrop && (
                <ul className={styles.dropdown}>
                    {dropDownOptions}
                </ul>
            )}
            {props.children}
        </div>
    )
}
export default DropDown