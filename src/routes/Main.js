import styles from './Main.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { baseUrl } from '../App';
import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

const Main = () => {
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
    const setUsername = useAuthStore((state) => state.setUsername);
    const setPeriodId = useAuthStore((state) => state.setPeriodId);

    const authData = useAuthStore();

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/users/login`, {
                email: loginId,
                password: password,
            });
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            setUsername(response.data.data.username);
            setIsLoggedIn(true);
            setPeriodId(response.data.data.periodId);
            if (authData.periodId) {
                navigate(`/period/${authData.periodId}`);
            } else {
                navigate('/admin');
            }
        } catch (err) {
            alert(err.response.data.message || '로그인 실패 하셨습니다.');
        }
    };

    const navigate = useNavigate();

    return (
        <div className={styles.loginForm_wrapper}>
            <h1>로그인 하기</h1>
            <input placeholder="아이디를 입력하세요..." onChange={(e) => setLoginId(e.target.value)}></input>
            <input placeholder="비밀번호를 입력하세요..." onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => login()}>로그인 하기</button>
            <button onClick={() => navigate('/signup')}>회원가입 하기</button>
        </div>
    );
};

export default Main;
