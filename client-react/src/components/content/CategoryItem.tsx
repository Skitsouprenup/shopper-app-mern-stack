import React from 'react';
import { useNavigate } from 'react-router-dom';

import categoriesstyle from '../../css/container/categories.scss';

type propstype = {title: string, cover: string};
const CategoryItem = ({title, cover} : propstype) => {
  const navigate = useNavigate();

  return (
    <div className={categoriesstyle['item']}>
        <div className={categoriesstyle['content']}>
            <h2 className={categoriesstyle['title']}>
                {title}
            </h2>
            <button type='button' className={categoriesstyle['button']}
                    onClick={() => navigate('categorypage/'+title)}>
                View
            </button>
            <img alt={title + ' ' + 'image'}
              src={cover}
              className={categoriesstyle['image']}/>
        </div>
    </div>
  );
};

export default CategoryItem;