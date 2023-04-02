import 'normalize.css';
import './css/index.scss';

import Home from './components/container/Home';
import FrontPageContainer from './components/container/FrontPageContainer';
import LoadingComponent from './components/content/LoadingComponent';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxStore from './scripts/redux/reduxstore';

const CategoryPage = React.lazy(() => import('./components/container/CategoryPage'));
const ProductPage = React.lazy(() => import('./components/container/ProductPage'));
const Register = React.lazy(() => import('./components/container/Register'));
const Login = React.lazy(() => import('./components/container/Login'));
const Cart = React.lazy(() => import('./components/container/Cart'));
const ProfilePage = React.lazy(() => import('./components/container/ProfilePage'));
const SearchPage = React.lazy(() => import('./components/content/SearchPage'));
const UnsubNewsletter = React.lazy(() => import('./components/content/newsletter/UnsubNewsletter'));

const root = ReactDOM.createRoot(document.getElementById("app-root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Provider store={reduxStore}>
            <Suspense fallback={<LoadingComponent />}>
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
                        <Route path='login'
                            element={<Login />} />
                        <Route path='profile' element={<ProfilePage />} />
                        <Route path='newsletter/unsub/:unsubCode'
                            element={<UnsubNewsletter />} />
                        <Route path="*" element={<h1>404 Not Found</h1>} />
                    </Routes>
                </BrowserRouter>
            </Suspense>
        </Provider>
    </React.StrictMode>);