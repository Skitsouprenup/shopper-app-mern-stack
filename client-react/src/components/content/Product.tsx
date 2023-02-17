import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';

import popularprodstyle from '../../css/container/minifiedproducts.scss';
import { MinifiedProduct } from '../../scripts/types/producttypes';
import { likeProduct } from '../../scripts/crud/products/likeproduct';
import { setUserCredentials } from '../../scripts/crud/users/localstorageop/setusercredentials';
import { useAppSelector } from '../../scripts/redux/hooks';

const Product = ({ item } : { item: MinifiedProduct }) => {
  const[isLiked, setIsLiked] = useState<boolean | null>(null);
  const[likeLoading, setLikeLoading] = useState<boolean>(false);

  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(item.isLiked);
  },[item.isLiked]);

  const setLikeProduct = () => {
    if(!likeLoading) setLikeLoading(true);
    const likeStatus = likeProduct(item._id as string, isLoggedIn, true);

    if(likeStatus) {
        likeStatus.
        then((resp) => {
            if(resp.status === 200) {
                return resp.json();
            } else return undefined;
        }).
        then((data) => {
            if(data) {
                const receivedStatus: boolean = data?.isLiked as boolean;
                const likes: number = data?.likeCount as number;
                setUserCredentials(data?.username, data?.accesstoken);
                setIsLiked(receivedStatus);
            }
            setLikeLoading(false);
        }).
        catch((e) => {
            console.error(e);
            setLikeLoading(false);
        })
    }
}

  return (
    <div className={popularprodstyle['content']}>
      <div className={popularprodstyle['image-content']}>

      {
        isLoggedIn && (
        <div className={popularprodstyle['icon-container']}>
          {
            likeLoading ? <p>...</p> :
            (<div 
              className={popularprodstyle['icon']}
              onClick={setLikeProduct}>
              {
                isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />
              }
             </div>)
          }
        </div>)
      }

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