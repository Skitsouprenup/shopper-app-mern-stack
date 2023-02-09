import React from 'react';
import { productCategories } from '../../scripts/productcategories';
import CategoryItem from '../content/CategoryItem';

import categoriesstyle from '../../css/container/categories.scss';

const Categories = () => {
  return (
    <div className={categoriesstyle['categories-container']}>
      {productCategories.map((item) => {
        return <CategoryItem title={item.title}
                             cover={item.cover}
                             key={item.title}/>
      })}
    </div>
  );
};

export default Categories;