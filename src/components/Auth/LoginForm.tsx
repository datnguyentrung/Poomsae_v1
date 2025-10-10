import { useState } from 'react';
import { login } from '@/services/authentication/authService';
import { saveAccessToken } from '@/utils/AuthUtil';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import './LoginForm.scss';
import { getDeviceInfo } from '@/utils/DeviceInfo';

const LoginForm = () => {
    const [idAccount, setIdAccount] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { uniqueId: idDevice } = getDeviceInfo();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    console.log('Device ID:', idDevice);
    console.log('ID Account:', idAccount);
    console.log('Password:', password);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login({ idAccount, password, idDevice });
            console.log('Login response:', data);
            saveAccessToken(data.data.access_token);
            toast.success('Đăng nhập thành công!');
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Sai tài khoản hoặc mật khẩu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header với icon shield */}
                <div className="login-header">
                    <div className="logo-container">
                        <Shield className="logo-icon" />
                    </div>
                    <h2>Chào mừng trở lại</h2>
                    <p className="subtitle">Đăng nhập để tiếp tục với Taekwondo Management</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="idAccount" className="form-label">
                            <User className="label-icon" />
                            Tên tài khoản
                        </label>
                        <div className="input-wrapper">
                            <User className="input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                id="idAccount"
                                value={idAccount}
                                onChange={(e) => setIdAccount(e.target.value)}
                                placeholder="Nhập tên tài khoản của bạn"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <Lock className="label-icon" />
                            Mật khẩu
                        </label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu của bạn"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        className={`login-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                Đang đăng nhập...
                            </div>
                        ) : (
                            <>
                                Đăng nhập
                                <ArrowRight className="button-icon" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p>
                        Chưa có tài khoản?
                        <NavLink to="/sign-up-account" className="signup-link">
                            Đăng ký ngay
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
