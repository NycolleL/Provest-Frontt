'use client';

import styles from './page.module.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', senha: '' });
    const [erros, setErros] = useState({ msg: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const loginValidation = async (e) => {
        e.preventDefault();
        const { email, senha } = formData;
    
        // Gera o hash da senha usando MD5 (substitua pelo algoritmo correto, se diferente)
        const hashedPassword = CryptoJS.MD5(senha).toString();
    
        const getUsers = async () => {
            const url = 'https://provest-ehefgcbyg0g2d6gy.brazilsouth-01.azurewebsites.net/v1/jengt_provest/alunos';
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch (error) {
                alert('Houve um problema com a solicitação de login.');
                return [];
            }
        };
    
        const usuarios = await getUsers();
        let userStatus = false;
    
        if (usuarios && usuarios.alunos) {
            usuarios.alunos.forEach(user => {
                if (user.email === email && user.senha === hashedPassword) {
                    userStatus = true;
             

                    localStorage.setItem('userId', user.id);
                    localStorage.setItem('userProfile', JSON.stringify({
                        name: user.name,
                        email: user.email,
                        curso: user.curso, 
                        avatar: 2
                    }));
                    
    
                    router.push('/concluido');
                }
            });
        }
    
        if (!userStatus) {
            setErros({ msg: 'Credenciais inválidas. Tente novamente.' });
        }
    };
    

    return (
        <div className={styles['right-side']}>
            <div className={styles.welcome}>
                <h1>BEM VINDO ALUNO!</h1>
            </div>
    
            <div className={styles['login-form']}>
                <h1>Login</h1>
                <form onSubmit={loginValidation}>
                    <div className={styles['form-group']}>
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
    
                    <div className={styles['form-group']}>
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
    
                    <div className={styles['button-container']}>
                        <button type="submit" className={styles['btn-login']}>Login</button>
                    </div>
                </form>
                {erros.msg && <div className={styles['error-msg']}>{erros.msg}</div>}
            </div>
    
            <div className={styles['create-account']}>
                <Link href="./signupAluno">Não tem uma conta? Cadastre-se</Link>
            </div>
        </div>
    );
};
export default Login;
