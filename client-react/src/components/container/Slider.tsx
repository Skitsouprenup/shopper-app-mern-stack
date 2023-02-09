import React from 'react';

import sliderstyle from '../../css/container/slider.scss';
import SliderImpl from '../content/slides/SliderImpl';

/*
  Basic and naive slider implementation
 */
const Slider = () => {

  return (
    <div className={sliderstyle['slider-container']}>
      <SliderImpl />
    </div>
  );
};

export default Slider;