import React, { useState } from 'react';
import styles from './search-input.module.scss'
import {SearchInputFieldProps} from "../../interfaces/SearchInputFields";
import searchIco from '../../assets/images/search.png'
const SearchInput = (props:SearchInputFieldProps)=> {
    return(
        <div className={styles.form}>

            <input className={styles.input} type="text" placeholder={props.placeHolder} aria-label={props.ariaLabel}/>
            <i className={styles.search_icon}>
                <i style={{color:'#0a66c2'}} className="fa fa-search" aria-hidden="true"></i>
            </i>
        </div>
    )
}
export default SearchInput