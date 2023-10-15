import React, { useState } from 'react';
import styles from './filter-btn.module.scss'

interface FilterBtnProps {
    text: string;
}
const FilterBtn: React.FC<FilterBtnProps> = ({text})=> {
    return(
      <div className={styles.filter_btn}>
          {text}
      </div>
    )
}
export default FilterBtn