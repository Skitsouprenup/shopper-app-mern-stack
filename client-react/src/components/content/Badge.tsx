import React from 'react';

import { useAppSelector } from '../../scripts/redux/hooks';

const Badge = () => {
    const cartQuantity = useAppSelector(state => state.cart.count);

    const badgeStyle : React.CSSProperties = {
        position: 'absolute',
        top: '0',
        left: '100%',
        transform: 'translateX(-100%)',
        width: '16px',
        height: '16px',
        backgroundColor: 'rgb(76, 139, 217)',
        color: 'white',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.75rem',
    };

    return (
        <div style={badgeStyle}>
            {cartQuantity}
        </div>
    );
};

export default Badge;