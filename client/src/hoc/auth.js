import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {

    // option이 null 아무나 출입 가능
    // true 로그인한 사람만
    // false 로그인한 유저는 출입 불가능
    // dminRoute는 어드민만 근데 = null이 그냥 디폴트 값


    function AuthenticationCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option){
                        props.history.push('/login') // 로그인 하지 않은 사람이 들어오려 하면 /login으로 보냄
                    }
                } else {
                    // 로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){ // 로그인 한 사람이 어드민만 들어갈 수 있는 페이지 들어가려고 할때
                        props.history.push('/')
                    } else{
                        if (option === false) // 로그인한 유저가 출입 불가능 한 페이지 가려고 할때 (ex 로그인했는데 또 로그인 페이지 가려는 경우)
                        props.history.push('/')
                    }
                }


            })
        }, [])

        return (
            <SpecificComponent />
        )

    }

    return AuthenticationCheck
}