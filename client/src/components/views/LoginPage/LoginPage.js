import React, { useState } from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux';
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom';
function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("") // 처음에 빈칸
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body)) // 로그인 되면 랜딩 페이지로 이동 리엑트에서 페이지 이동시 이런식으로 해줌 props.history.push 이용
            .then(response => {
                if(response.payload.loginSuccess) {
                    props.history.push('/')
                } else{
                    alert('Error')
                }
            })

        

    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        
        </div>
    )
}

export default withRouter(LoginPage)