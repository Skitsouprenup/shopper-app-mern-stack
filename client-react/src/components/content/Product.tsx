import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosInformation } from 'react-icons/io';

import popularprodstyle from '../../css/container/minifiedproducts.scss';
import { MinifiedProductProjection } from '../../scripts/types/producttypes';

const Product = ({item} : {item: MinifiedProductProjection}) => {
  const navigate = useNavigate();

  return (
    <div className={popularprodstyle['content']}>

      <div className={popularprodstyle['image-content']}>

        <div className={popularprodstyle['icon-container']}>
          <div className={popularprodstyle['icon']}>
            <IoIosHeartEmpty />
          </div>
          <div className={popularprodstyle['icon']}
               style={{fontSize: '40px'}}>
            <IoIosInformation />
          </div>
        </div>

        <img src={item.imgPrimary} alt='image not available'
             className={popularprodstyle['image']}/>
      </div>

      <p className={popularprodstyle['title']}
         onClick={() => navigate('/productpage/'+item._id)}
         role='button'>
        {item.title}
      </p>

    </div>
  );
};

export default Product;