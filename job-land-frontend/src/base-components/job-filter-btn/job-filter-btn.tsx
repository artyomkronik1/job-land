import React, {useEffect, useRef, useState} from 'react';
import styles from './job-filter-btn.module.scss'
import {useTranslation} from "react-i18next";

interface JobFilterBtnProps {
    text: string;
    options:string[]
    changeFilterValue(value:string, type:string):void;
    type:string;
}
const JobFilterBtn= (props:JobFilterBtnProps)=> {
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    // listening when user click outside of dropdown so close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener    ('mousedown', handleClickOutside);
        };
    }, []);
    const [active, setactive] = useState(false);
    const [checkedValue, setCheckedValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const setFilterValue=(value:string)=>{
        setIsOpen(true)
        setactive(!active)
        setCheckedValue(value)
        props.changeFilterValue(value, props.type);
    }
    const dropDownOptions=    props.options.map((value, index)=>(
        <div key={index} style={{display:'flex', alignItems:'center', justifyContent:'center'}}  onClick={()=>setFilterValue(value)} className={` ${active && checkedValue==value ? `${styles.checked_dropdown_option}` :`${styles.dropdownOption}`}`}>
            {active && value==checkedValue?(<span  style={{display:'block', borderRadius:'50%', color:'#0a66c2', backgroundColor:'white', height:'5px', width:'5px'}}></span>):
                (<span  style={{display:'block', borderRadius:'50%', backgroundColor:'#0a66c2', height:'5px', width:'5px'}}></span>)}
                  <li style={{fontSize:'18px'}} key={index} >{t(value)}</li>
        </div>
    ))
    return(
        <div className={` ${active ? `${styles.checked_dropdown}` :`${styles.form}`}`} ref={dropdownRef} onClick={toggleDropdown}>
            <div  style={{display:'flex',gap:'8px', alignItems:'center'}}>
                <span style={{fontSize:'22px'}}>{t(props.text)}</span>
                {active?(<i style={{color: 'white', 'fontSize':'15px'}}  className={`fa fa-caret-${isOpen ? 'up' : 'down'}`}  ></i>):
                    (<i style={{color: '#0a66c2', 'fontSize':'15px'}}  className={`fa fa-caret-${isOpen ? 'up' : 'down'}`}  ></i>)}
                </div>
            {/*dropdown options*/}
            <div style={{display:'flex' , position:'relative', alignItems: 'start', justifyContent:'center'}}>
                {isOpen && (
                <div className={` ${active ? `${styles.activeMargin}` :`${styles.dropdown}`}`} >
                    {dropDownOptions}
                </div>
            )}
            </div>
        </div>
    )
}
export default JobFilterBtn