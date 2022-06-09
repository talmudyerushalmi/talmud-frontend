import React from 'react';
import spinnerGif from '../../assets/spinner-gif.gif'

interface Props {
    display: boolean
}

const Spinner = (props: Props)=>{
    const { display } = props;
    return (
        <div>
            <img hidden={!display} src={spinnerGif}></img>
        </div>
    )

}

export default Spinner