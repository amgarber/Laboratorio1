import React, { useEffect, useRef, useState } from 'react';
import '../css/Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const Login = ({ FormHandle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectAfterLogin = location.state?.redirectAfterLogin;
    const hasShownToast = useRef(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formMessage, setFormMessage] = useState({ text: '', type: '' });

    const redirectProperly = () => {
        FormHandle("HomePage");
        if (redirectAfterLogin) {
            const fromEmail = location.state?.fromEmailLink;
            if (fromEmail) {
                navigate(redirectAfterLogin, { replace: true });
            } else {
                navigate(redirectAfterLogin);
            }
        } else {
            navigate("/home");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormMessage({ text: '', type: '' });

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log(" Login data from backend:", data);

            if (!response.ok) {
                setFormMessage({ text: data.message || 'Login fallido', type: 'error' });
                setLoading(false);
                return;
            }

            setFormMessage({ text: 'Login successful!', type: 'success' });
            setTimeout(() => {
                setFormMessage({ text: '', type: '' });
            }, 3000);

            setTimeout(() => {
                setFormMessage({ text: '', type: '' });

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("token", data.token);
                const decoded = jwtDecode(data.token);
                localStorage.setItem("tokenData", JSON.stringify({
                    userId: data.user.id,
                    username: data.user.username,
                    pictureUrl: data.user.pictureUrl
                }));
                localStorage.setItem("role", data.user.role);

                redirectProperly();
            }, 2000); // ⏱ Espera 2 segundos


        } catch (error) {
            console.error('Error al hacer login:', error);
            setFormMessage({ text: 'Ocurrió un error inesperado', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        setIcon(type === 'password' ? eye : eyeOff);
        setType(type === 'password' ? 'text' : 'password');
    };

    useEffect(() => {
        if (!hasShownToast.current && location.state?.toastMessage) {
            toast.warn(location.state.toastMessage);
            hasShownToast.current = true;
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <div className="general-div">
            <div className="main-div">
                <div className="login-container">
                    <h1 className="login-title">Welcome <br /> back!</h1>
                    <p className="login-subtitle">
                        Access your account securely by using your email and password
                    </p>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <img src="/EnvelopeSimple.svg" alt="Email icon" />
                            <input
                                type="email"
                                placeholder="Enter email or username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <img src="/Lock.svg" alt="Lock icon" />
                            <input
                                type={type}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <span className="toggle-password-icon" onClick={handleToggle}>
                                <Icon icon={icon} size={20} color="white" />
                            </span>
                        </div>

                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>

                        {/*  Mostrar mensaje como en Register */}
                        {formMessage.text && (
                            <div className={`form-message ${formMessage.type}`}>
                                {formMessage.text}
                            </div>
                        )}

                        <button type="submit" className="LoginButton" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="login-divider">
                        <div className="line" />
                        <span className="or">Or continue with</span>
                        <div className="line" />
                    </div>

                    <div className="login-google">
                        <GoogleLogin
                            onSuccess={async credentialResponse => {
                                const res = await fetch("http://localhost:3001/api/google-login", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ credential: credentialResponse.credential }),
                                });

                                const data = await res.json();
                                if (!res.ok) return setFormMessage({ text: data.message || "Error", type: "error" });

                                localStorage.setItem("isLoggedIn", "true");
                                localStorage.setItem("token", data.token);
                                localStorage.setItem("tokenData", JSON.stringify({
                                    userId: data.user.id,
                                    username: data.user.username,
                                    pictureUrl: data.user.picture?.url || ""
                                }));
                                localStorage.setItem("role", data.user.role);

                                redirectProperly();
                            }}
                            onError={() => {
                                setFormMessage({ text: "Login con Google falló", type: "error" });
                            }}
                        />
                    </div>
                </div>

                <div className="footer-div">
                    <div className="login-footer">
                        Don’t have an account?{' '}
                        <span className="link" onClick={() => navigate("/register")}>
                            Sign up here.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;