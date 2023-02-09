import React from 'react';

import Slider from './Slider';
import Categories from './Categories';
import DisplayProducts from './DisplayProducts';

const FrontPageContainer = () => {

  return (
    <>
        <Slider />
        <Categories/>
        <h2 style={{
          marginTop: '10px',
        }}>Popular Products</h2>
        <DisplayProducts showPopular={true}/>
    </>
  );
};

export default FrontPageContainer;