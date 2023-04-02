import React from 'react';

import { MutatingDots } from 'react-loader-spinner';

const LoadingComponent = () => {

    const componentStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
    };

    return (
        <div style={componentStyle}>
            <MutatingDots
                height="100"
                width="100"
                color="#4fa94d"
                secondaryColor='#4fa94d'
                radius='12.5'
                ariaLabel="mutating-dots-loading"
            />Loading...
        </div>
    );
};

export default LoadingComponent;