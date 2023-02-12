import React from 'react';

const NoProductToDisplay = 
  ({msg, color = 'gray'} : 
   {msg: string, color?: string}) => {
  return (
    <div style={{
        color,
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