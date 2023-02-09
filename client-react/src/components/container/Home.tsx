import React from 'react';

import Navbar from '../content/Navbar';
import Announcement from '../content/Announcement';

import index from '../../css/index.scss';
import Newsletter from '../content/Newsletter';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <Announcement />
      <div className={index['main-content']}>
        <Navbar />
        <Outlet />
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Home;