import React, { useState } from 'react';
import styles from './job-filter-btn.module.scss'

interface JobFilterBtnProps {
    text: string;
    options:string[]
    changeFilterValue(value:string):void;
}
const JobFilterBtn= (props:JobFilterBtnProps)=> {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const setFilterValue=(value:string)=>{
        setIsOpen(true)
        props.changeFilterValue(value);
    }
    const dropDownOptions=    props.options.map((value, index)=>(
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', marginInlineStart:'10px'}}>
            <span style={{display:'block', borderRadius:'50%', backgroundColor:'#0a66c2', height:'5px', width:'5px'}}></span>
        <li  key={index} onClick={()=>setFilterValue(value)} className={styles.dropdownOption}>{value}</li>
        </div>
    ))
    return(
        <div className={styles.form} >
            <div onClick={toggleDropdown} style={{display:'flex',gap:'8px'}}>
            {props.text}
            <i style={{color: '#0a66c2', 'fontSize':'15px'}}  className="fa fa-caret-down" ></i>
            </div>
                {isOpen && (
                <ul className={styles.dropdown}>
                    {dropDownOptions}
                </ul>
            )}
        </div>
    )
}
export default JobFilterBtn