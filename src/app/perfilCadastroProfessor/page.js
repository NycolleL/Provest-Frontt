'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './page.module.css';
import AvatarSelector, { ProfileIcon } from '@/components/ui/AvatarSelector';

const ProfileProfPage = () => {
  const [profile, setProfile] = useState({
    name: '',
    curso: '', // Curso do professor
    horarios: '',
    email: '',
    password: '',
  });

  const [avatar, setAvatar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    Modal.setAppElement('#modal-root');

    // Carregar os ícones da API
    const fetchIcons = async () => {
      try {
        const response = await fetch(
          'https://provest-ehefgcbyg0g2d6gy.brazilsouth-01.azurewebsites.net/v1/jengt_provest/icones'
        );
        const data = await response.json();

        if (response.ok && Array.isArray(data.icones)) {
          setIcons(data.icones);
          const defaultAvatar = data.icones.find((icon) => icon.id === 3);
          setAvatar(defaultAvatar?.url || '/default-avatar3.png');
        } else {
          console.error('Erro ao buscar os ícones.');
        }
      } catch (error) {
        console.error('Erro ao buscar os ícones:', error);
      }
    };

    fetchIcons();

    // Carregar os dados do professor do localStorage
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const parsedProfile = JSON.parse(userProfile);
      setProfile({
        name: parsedProfile.name || '',
        curso: parsedProfile.curso || '', // Curso fixo carregado
        horarios: parsedProfile.horarios || '',
        email: parsedProfile.email || '',
        password: '', // Senha é sempre vazia para edição
      });
      setAvatar(parsedProfile.avatar || '/default-avatar3.png');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.password) {
      alert('Por favor, insira uma nova senha.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Usuário não identificado.');
      return;
    }

    try {
      const response = await fetch(`/v1/jengt_provest/prof/senha/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senha: profile.password }),
      });

      if (response.ok) {
        alert('Senha atualizada com sucesso!');
        setProfile({ ...profile, password: '' });
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar senha: ${errorData.message || 'Tente novamente mais tarde.'}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      alert('Erro inesperado. Verifique sua conexão e tente novamente.');
    }

    const updatedProfile = { ...profile, avatar };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setIsModalOpen(false);
  };

  return (
    <div className={styles['profile-page']}>
      <div className={styles['header']}>
        <div className={styles['avatar-preview']} onClick={() => setIsModalOpen(true)}>
          <ProfileIcon avatar={avatar} />
        </div>
        <h1 className={styles['profile-name']}>{profile.name || 'Nome do Professor'}</h1>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        contentLabel="Select Avatar"
      >
        <AvatarSelector onSelect={handleAvatarSelect} icons={icons} />
      </Modal>

      <form className={styles['profile-form']} onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <input type="text" id="name" name="name" placeholder="Nome" value={profile.name} readOnly />
        </div>

        <div className={styles['form-group']}>
          <input
            type="text"
            id="curso"
            name="curso"
            value={profile.curso} // Exibe o curso
            readOnly
            className={styles['curso-input']}
          />
        </div>

        <div className={styles['form-group']}>
          <input
            type="text"
            id="horarios"
            name="horarios"
            placeholder="Horários"
            value={profile.horarios}
            readOnly
          />
        </div>

        <div className={styles['form-group']}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            readOnly
          />
        </div>

        <div className={styles['form-group']}>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Mudar senha"
            value={profile.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles['save-button']}>
          SALVAR
        </button>
      </form>
    </div>
  );
};

export default ProfileProfPage;
