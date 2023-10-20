import React from 'react';
import {FadeLoader} from "react-spinners"; // Create a CSS file for styling

const Spinner = () => {
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}} >
            <FadeLoader color="#0a66c2"
                        height={25}
                        margin={50}
                        radius={150}
                        width={25}/>
        </div>
    );
};

export default Spinner;