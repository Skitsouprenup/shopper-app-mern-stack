import React, { memo, useEffect, useState } from 'react';

import slidecontent from '../../../css/content/slides/slidecontent.scss';

type propstype = {setOffersLn: React.Dispatch<React.SetStateAction<number>>};
const SliderContent = ({setOffersLn} : propstype) => {
  const[offers, setOffers] = useState<JSX.Element[]>([]);

   /*
    divId must be <slide+number> e.g. slide0
    The first element in the slider must start with 0
    and increment by 1 until the last element.
    e.g. slide0, slide1, slide2
   */
  useEffect(() => {
    setOffers([
      <ContentOne key='slide0' divId='slide0'/>,
      <ContentTwo key='slide1' divId='slide1'/>,
      <ContentThree key='slide2' divId='slide2'/>,
    ]);
  },[]);

  useEffect(() => {
    if(offers)
      setOffersLn(offers?.length);
  },[offers]);

  const imgDivStyle : React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  }

  const imgStyle : React.CSSProperties =  {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  };
  
  const ContentOne = ({divId} : {divId : string}) => {

    return (
      <div style={imgDivStyle} id={divId}>

        <div className={slidecontent['slideone']}>
          <h1 className={slidecontent['title-slideone']}>
            Brand New Cameras on Sale!
          </h1>
          <div className={slidecontent['content-slideone']}>
            <p>
              We have lots of brand new cameras and some of them have discounts!
            </p>
            <button type="button" className={slidecontent['slider-button']}>
              Check Them Out!
            </button>
          </div>
        </div>

        <img style={imgStyle} 
             src='https://i.ibb.co/NWPFPcq/pexels-math-90946.jpg'
             alt='picture'/>

      </div>
    );
  };
  
  const ContentTwo = ({divId} : {divId : string}) => {

    return (
        <div style={imgDivStyle} id={divId}>

          <div className={slidecontent['slidetwo']}>
            <div className={slidecontent['content-slidetwo']}>
              <h1 className={slidecontent['title-slidetwo']}>
                Affordable Top-notch laptops available!
              </h1>
              <button type="button" className={slidecontent['slider-button']}>
                Browse Laptops
              </button>
            </div>
          </div>

          <img style={imgStyle} 
               src='https://i.ibb.co/P5Qnk8R/pexels-pixabay-4158.jpg'
               alt='picture'/>
        </div>
      );
  };
  
  const ContentThree = ({divId} : {divId : string}) => {

      return (
          <div style={imgDivStyle} id={divId}>
            <div className={slidecontent['slidethree']}>
              <h1 className={slidecontent['title-slidethree']}>
                Sales Bonanza this Week!
              </h1>
              <div className={slidecontent['content-slidethree']}>
                <p>
                  Lots of products are on sale right now. What are you waiting for?<br />
                  Click the button below and check all sales!
                </p>
                <button type="button" className={slidecontent['slider-button']}>
                  Shop Now!
                </button>
              </div>
            </div>
            
            <img style={imgStyle}  
                 src='https://i.ibb.co/RjSBhf0/pexels-karolina-grabowska-5650026.jpg'
                 alt='picture'/>
          </div>
      );
  };

  return(
    <>
      {offers &&
       offers.map((item) => {
        return item;
       })}
    </>
  );

};

export default memo(SliderContent);