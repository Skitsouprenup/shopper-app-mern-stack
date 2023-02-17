import React, { useState } from 'react';

import Navbar from '../content/Navbar';
import Announcement from '../content/Announcement';

import index from '../../css/index.scss';
import Newsletter from '../content/Newsletter';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';
import { SearchItemContext } from '../../scripts/appcontext';
import { useAppSelector } from '../../scripts/redux/hooks';

const Home = () => {
  const[searchItem, setSearchItem] = useState<string>('');
  const{ isLoggedIn } = useAppSelector((state) => state.user);

  return (
    <main>
      <Announcement />
      <div className={index['main-content']}>
        <Navbar setSearchItem={setSearchItem}/>
        <SearchItemContext.Provider value={{searchItem}}>
          <Outlet />
        </SearchItemContext.Provider>
      </div>
      {
        isLoggedIn && <Newsletter />
      }
      <Footer />
    </main>
  );
};

export default Home;