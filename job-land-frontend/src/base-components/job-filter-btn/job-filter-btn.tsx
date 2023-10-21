import React, {useEffect, useRef, useState} from 'react';
import styles from './job-filter-btn.module.scss'

interface JobFilterBtnProps {
    text: string;
    options:string[]
    changeFilterValue(value:string, type:string):void;
    type:string;
}
const JobFilterBtn= (props:JobFilterBtnProps)=> {
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
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const setFilterValue=(value:string)=>{
        setIsOpen(true)
        props.changeFilterValue(value, props.type);
    }
    const dropDownOptions=    props.options.map((value, index)=>(
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', marginInlineStart:'10px'}}  onClick={()=>setFilterValue(value)}className={styles.dropdownOption}>
            <span  style={{display:'block', borderRadius:'50%', backgroundColor:'#0a66c2', height:'5px', width:'5px'}}></span>
             <li style={{fontSize:'18px'}} key={index} >{value}</li>
        </div>
    ))
    return(
        <div className={styles.form} ref={dropdownRef} onClick={toggleDropdown}>
            <div  style={{display:'flex',gap:'8px', alignItems:'center'}}>
                <span style={{fontSize:'20px'}}>{props.text}</span>
            <i style={{color: '#0a66c2', 'fontSize':'15px'}}  className={`fa fa-caret-${isOpen ? 'up' : 'down'}`}  ></i>
            </div>
            <div style={{display:'flex' , position:'relative', alignItems: 'start', justifyContent:'center'}}>
                {isOpen && (
                <ul className={styles.dropdown}>
                    {dropDownOptions}
                </ul>
            )}
            </div>
        </div>
    )
}
export default JobFilterBtn