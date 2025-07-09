import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';


const Login = () => {

    const [ formData,setFormData ] = useState({email: '' , password: ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({...formData , [e.target.name] : e.target.value});
        if (error){
            setError('');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError('');
        try {
            const res = await authAPI.login(formData.email,formData.password);

            if(res.data.success){
                login(res.data.client);
            }else{
                const msgerr = res.data.message || 'Login failed';
                console.error(msgerr);
                setError(msgerr);
            }
        }catch(e) {
            console.log('Error ' , e);
            setError(error.res?.data?.message || 'Error ?');
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-container'>
            <div className='login-card'>
            <div className='logo'>
                <h2>AMANA</h2>
                <p className="text-muted">Gestion des Colis</p>
            </div>
            <form onSubmit={handleSubmit}>
                {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div> )}
                <div className='mb-3'>
                    <label htmlFor="email">Email</label>
                    <input type='email' className='form-control' id='email' name='email' value={formData.email} onChange={handleChange} required placeholder='name@email.com' />
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Password</label>
                    <input type='password' className='form-control' id='password' name='password' value={formData.password} onChange={handleChange} required placeholder='........' />
                </div>

                <button type='submit' className='btn btn-primary' disabled={loading}>
                    {loading ? 
                    (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Connexion...</>) : 
                    ('Se connecter')}
                </button>
            </form>
            <div className='mt-3 text-center'>
                <small>
                    Test : abd@gmail.com / CDE@gmail.com<br />
                    mdp : password123
                </small>
            </div>
            </div>
        </div>
    );
}

export default Login;