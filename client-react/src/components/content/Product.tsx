import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';

import popularprodstyle from '../../css/container/minifiedproducts.scss';
import { MinifiedProductProjection } from '../../scripts/types/producttypes';
import { likeProduct, verifyLike } from '../../scripts/crud/products/likeproduct';
import { setUserCredentials } from '../../scripts/crud/users/localstorageop/setusercredentials';
import { useAppDispatch, useAppSelector } from '../../scripts/redux/hooks';
import { loginUserState } from '../../scripts/redux/slices/userslice';

const Product = ({item} : {item: MinifiedProductProjection}) => {
  const[isLiked, setIsLiked] = useState<boolean>(false);
  const[likeLoading, setLikeLoading] = useState<boolean>(false);

  const reduxDispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const likeStatus = 
        verifyLike(signal, item._id as string, false);

    if(likeStatus) {
        likeStatus.
        then((resp) => {
            if(resp?.status === 200) {
                return resp.json();
            } else return undefined;
        }).
        then((data) => {
            if(data) {
                if(data?.username && data?.accesstoken) {
                  reduxDispatch(loginUserState());
                  setUserCredentials(data?.username, data?.accesstoken);
                  const receivedStatus: boolean = data?.isLiked as boolean;
                  setIsLiked(receivedStatus);
                }
            }
        }).
        catch((e) => {
            if(!signal.aborted) {
                console.error(e);
            }
        });
    }

    return () => controller.abort();
  },[item._id]);

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