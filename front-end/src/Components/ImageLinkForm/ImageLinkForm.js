import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm= ({onChange, onButtonClick})=>{
    return(
        <div className='f3'>
        <p className='center white'>This program will detect face on your picture (add http address)</p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                 <input 
                     className="f4 pa2  w-70 center" type="text"
                     onChange={onChange}
                 />
                 <button 
                    className="center w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
                    onClick={onButtonClick} 
                    >Start</button>
                </div>
            </div>
        </div>
        )
}

export default ImageLinkForm
