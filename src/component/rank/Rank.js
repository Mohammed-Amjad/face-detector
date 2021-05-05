import React from 'react';

const Rank = ({name, count}) => {
    return (
        <div>
            <div className='centre white f3'>
                {`Hi ${name}, you have detected ${count} images till now`}
            </div>
        </div>
    );
}

export default Rank;