import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchUserInfo } from '../../scripts/crud/users/fetchuserinfo';
import { FetchedUser } from '../../scripts/types/usertypes';
import { decimal128ToString } from '../../scripts/utilities';
import GotoHome from '../content/GotoHome';

import profilestyle from '../../css/container/profilepage.scss';
import NoProductToDisplay from '../content/NoProductToDisplay';

const ProfilePage = () => {
    const navigate = useNavigate();
    const[loading, setLoading] = useState<boolean>(true);
    const[userInfo, setUserInfo] = useState<FetchedUser>();

    useEffect(() => {
        const controller = new AbortController;
        if(!userInfo) {
            fetchUserInfo(controller.signal, setUserInfo, setLoading, navigate);
        }

        return () => controller.abort();
    },[userInfo]);

    if(loading) return <div>Loading...</div>;

    return (
        <div className={profilestyle['profilepage-container']}>
            <div className={profilestyle['content']}>
                <div className={profilestyle['gotohome']}>
                    <GotoHome />
                </div>
                <div>
                    <h1>Profile</h1>
                    <hr style={{color: 'black'}}/>
                </div>
                <div className={profilestyle['profile-info']}>
                    <div className={profilestyle['item']}>
                        <p><b>Username:</b></p>
                        <p>{userInfo?.username}</p>
                    </div>
                    <div className={profilestyle['item']}>
                        <p><b>Full Name:</b></p>
                        <p>{userInfo?.lastname + ' ' + 
                            userInfo?.firstname + ' ' + 
                            userInfo?.middleInitial}</p>
                    </div>
                    <div className={profilestyle['item']}>
                        <p><b>E-mail Address:</b></p>
                        <p>{userInfo?.email}</p>
                    </div>
                    <div className={profilestyle['item']}>
                        <p><b>Account Created:</b></p>
                        <p>{userInfo?.createdAt?.toString()}</p>
                    </div>
                </div>
                <div>
                    <h1>Orders</h1>
                    <hr style={{color: 'black'}}/>
                </div>
                <div className={profilestyle['order-items-container']}>
                    {
                        userInfo?.orders.length ? 
                        userInfo?.orders.map((item) => {
                            return <h2>{decimal128ToString(item.total)}</h2>
                        }) :
                        <NoProductToDisplay 
                            msg='No Orders to Display.'
                            color='black' />
                    }
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;