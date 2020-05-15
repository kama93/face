import React from 'react';

const Rank= ({name, entries})=>{
    return(
        <div>
            <div className='white f3 center'>
                {`${name}, you current rank is...`}
            </div>
            <div className='white f3 center'>
                {entries}
            </div>
        </div>
        )

}

export default Rank