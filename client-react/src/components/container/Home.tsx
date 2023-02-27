import React, { useState } from 'react';

import Navbar from '../content/navbar/Navbar';
import Announcement from '../content/Announcement';

import index from '../../css/index.scss';
import Newsletter from '../content/newsletter/Newsletter';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';
import { SearchItemContext } from '../../scripts/appcontext';

const Home = () => {
  const[searchItem, setSearchItem] = useState<string>('');

  return (
    <main>
      <Announcement />
      <div className={index['main-content']}>
        <Navbar setSearchItem={setSearchItem}/>
        <SearchItemContext.Provider value={{searchItem}}>
          <Outlet />
        </SearchItemContext.Provider>
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Home;