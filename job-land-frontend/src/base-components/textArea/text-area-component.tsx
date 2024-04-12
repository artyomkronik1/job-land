import React, { useState } from 'react';

const TextAreaComponent = ({textPlaceHolder}:any)=> {
    return(
        <textarea placeholder={textPlaceHolder} className="text-area-component" rows={4} cols={50} maxLength={400}></textarea>
    )
}
export default TextAreaComponent