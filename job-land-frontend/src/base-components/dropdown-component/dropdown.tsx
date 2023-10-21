import React, { useState } from 'react';
import styles from './dropdown.module.scss'
import {DropdownProps} from "../../interfaces/DropdownProps";
import JobFilterBtn from "../job-filter-btn/job-filter-btn";

const DropDown = (props:DropdownProps)=> {
    const [openDrop, setopenDrop] = useState(false);
    const [value, setvalue] = useState('');

    const dropDownOptions=    props.options.map((value, index)=>(
        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}} className={styles.dropdownOption}>
            {props.icons?(
                <i className={`${props.icons[index]}`}></i>
            ):(null)}

            <li  key={index} onClick={()=>props.changeDropValue(value)} >{value}</li>
        </div>
    ))
    return(
        <div style={{  display:'flex', alignItems:'center', gap:'10px'}}  onClick={()=>setopenDrop(!openDrop)}>
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