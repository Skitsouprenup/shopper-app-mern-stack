import React from 'react';

const NoProductToDisplay = ({msg} : {msg: string}) => {
  return (
    <div style={{
        color: 'gray',
        fontSize: '3rem',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: '10px 0',
        fontWeight: '600',
    }}>
        {msg}
    </div>
  );
};

export default NoProductToDisplay;