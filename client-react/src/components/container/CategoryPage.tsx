import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { productCategories } from '../../scripts/productcategories';
import { sortOptions } from '../../scripts/sortoptions';

import categorypagestyle from '../../css/container/categorypage.scss';
import DisplayProducts from './DisplayProducts';

const CategoryPage = () => {
    const[category, setCategory] = useState<string>(useParams()?.category as string);
    const[sort, setSort] = useState<string>(sortOptions?.length ? sortOptions[0] : '');

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    return (
        <div className={categorypagestyle['categorypage-container']}>

            <div className={categorypagestyle['selection']}>
                <div className={categorypagestyle['components']}>
                    Category:
                    <select name="categories"
                            value={category}
                            className={categorypagestyle['dropdown']}
                            onChange={(e) => setCategory(e.target.value)}>
                        {
                            productCategories.map(
                                (item) => {
                                    let opt : JSX.Element | null = null;

                                    opt = <option value={item.title} key={item.title}>
                                            {item.title}
                                          </option>;
                                    return opt;
                                }
                            )
                        }
                    </select>
                </div>
                <div className={categorypagestyle['components']}>
                    Sort:
                    <select name="sortOptions"
                            className={categorypagestyle['dropdown']}
                            onChange={(e) => setSort(e.target.value)}>
                        {
                            sortOptions.map(
                                (item) => {
                                    return(
                                        <option value={item} key={item}>
                                            {item}
                                        </option>
                                    );
                                }
                            )
                        }
                    </select>
                </div>
            </div>
            <DisplayProducts wrap={true} sort={sort} category={category}/>

        </div>
  );
};

export default CategoryPage;