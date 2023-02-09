import React, {useState, useEffect} from 'react';

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import SliderContent from './SliderContent';

/*
  Careful re-rendering this component. Re-rendering this
  component may ruin the animation in this component. It's
  better not to re-render this component if not necessary.
*/
const SliderImpl = () => {
    const[offersLn, setOffersLn] = useState<number>(0);
    const[slideNumber, setSlideNumber] = useState<number>(0);

    useEffect(() => {
        loopSlides(offersLn, true);
    },[offersLn]);

    useEffect(() => {
        loopSlides(offersLn); 
    },[slideNumber]);

    const btnStyle : React.CSSProperties = {
        width: '64px',
        height: '64px',
        border: '1px solid lightgray',
        borderRadius: '60px',
        opacity: '0.75',
        zIndex: '10',
        cursor: 'pointer',
    };
    
    const leftBtnStyle : React.CSSProperties = {
        ...btnStyle,
        marginLeft: '5px',
    };

    const rightBtnStyle : React.CSSProperties = {
        ...btnStyle,
        marginRight: '5px',
    }

    const containerStyle : React.CSSProperties = {
        position: 'absolute',
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const loopSlides = (maxIndex : number, init : boolean = false) => {
        for(let x = 0; x < maxIndex; x++) {
          const elem = document.getElementById(`slide${x}`);
          if(elem !== null){
            if(!elem.style.transition && !init)
              elem.style.transition= 'transform 0.5s ease';
            elem.style.transform = `translateX(${moveSlides(x)}%)`;
          }
        }
    };
    
    const incrementSlideNumber = () => {
        const increment = slideNumber + 1;
        
        if(increment < offersLn)
            setSlideNumber(increment);
        else if(increment >= offersLn) 
            setSlideNumber(0);
    };
    
    const decrementSlideNumber = () => {
        const decrement = slideNumber - 1;

        if(decrement >= 0) 
            setSlideNumber(decrement);
        else if(decrement < 0) 
            setSlideNumber(offersLn - 1);
    };

    const moveSlides = (index: number) : number => {

        if(index < 0) {
            console.error('invalid slide index');
            return 0;
        }
        let percentage = 0;

        if(slideNumber > index) 
            percentage = (index - slideNumber) * 100;
        else if(slideNumber < index)
            percentage = (index - slideNumber) * 100;

        return percentage;

    };

    const LeftRightButtons = () => {

        return(
            <>
                <button type='button' 
                        onClick={decrementSlideNumber}
                        style={leftBtnStyle}>
                    <IoIosArrowBack style={{fontSize: '30px'}}/>
                </button>

                <button type='button' 
                        onClick={incrementSlideNumber}
                        style={rightBtnStyle}>
                    <IoIosArrowForward style={{fontSize: '30px'}}/>
                </button>
            </>
        );
    };

    return (
        <div style={containerStyle}>
            <LeftRightButtons />
            <SliderContent setOffersLn={setOffersLn}/>
        </div>
    );
};

export default SliderImpl;