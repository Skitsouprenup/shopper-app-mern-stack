import 'normalize.css';
import './css/index.scss';

import Home from './components/container/Home';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxStore from './scripts/redux/reduxstore';

import FrontPageContainer from './components/container/FrontPageContainer';
import CategoryPage from './components/container/CategoryPage';
import ProductPage from './components/container/ProductPage';
import Register from './components/container/Register';
import Login from './components/container/Login';
import Cart from './components/container/Cart';
import ProfilePage from './components/container/ProfilePage';
import SearchPage from './components/content/SearchPage';

const root = ReactDOM.createRoot(document.getElementById("app-root") as HTMLElement);

root.render(
<React.StrictMode>
    <Provider store={reduxStore}>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />}>
                    <Route index element={<FrontPageContainer />} />
                    <Route path='categorypage/:category' element={<CategoryPage />} />
                    <Route path='productpage/:productId' element={<ProductPage />} />
                    <Route path='search' element={<SearchPage />} />
                    <Route path='cart' element={<Cart />} />
                </Route>
                <Route path='register' element={<Register />} />
                <Route path='login' element={<Login />} />
                <Route path='profile' element={<ProfilePage />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    </Provider>
</React.StrictMode>);