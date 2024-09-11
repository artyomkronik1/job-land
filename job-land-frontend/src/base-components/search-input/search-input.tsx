import React, { useState } from 'react';
import styles from './search-input.module.scss'
import { SearchInputFieldProps } from "../../interfaces/SearchInputFields";

const SearchInput = (props: SearchInputFieldProps) => {
    return (
        <div className={styles.form}>

            <input value={props.value} className={styles.input} type="text" placeholder={props.placeHolder} aria-label={props.ariaLabel} onChange={(event) => props.onChange(event.target.value)}
            />
            <i className={styles.search_icon}>
                <i style={{ color: '#0a66c2' }} className={props.icon ? props.icon : "fa fa-search"} aria-hidden="true"></i>
            </i>
        </div>
    )
}
export default SearchInput