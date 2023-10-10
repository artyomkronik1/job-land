import { useState } from 'react';
import { useTranslation } from 'react-i18next';
const Login = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        // Add logic here to handle form submission (e.g., send data to a server)
        console.log('Submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1>{t('welcome')}</h1>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;