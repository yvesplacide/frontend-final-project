// frontend/src/services/authService.js
import Cookies from 'js-cookie';
import { mockUsers, delay } from './mockData';

const register = async (userData) => {
    try {
        await delay(500); // Simuler un délai réseau
        
        // Vérifier si l'email existe déjà
        const existingUser = mockUsers.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('Cet email est déjà utilisé');
        }

        // Créer un nouvel utilisateur
        const newUser = {
            id: mockUsers.length + 1,
            ...userData,
            role: 'user' // Par défaut, les nouveaux utilisateurs sont des utilisateurs normaux
        };

        // Simuler un token JWT
        const token = btoa(JSON.stringify({ id: newUser.id, role: newUser.role }));
        Cookies.set('token', token, { expires: 7 });

        return { user: newUser, token };
    } catch (error) {
        throw error.message;
    }
};

const login = async (userData) => {
    try {
        await delay(500); // Simuler un délai réseau

        const user = mockUsers.find(
            u => u.email === userData.email && u.password === userData.password
        );

        if (!user) {
            throw new Error('Email ou mot de passe incorrect');
        }

        // Simuler un token JWT
        const token = btoa(JSON.stringify({ id: user.id, role: user.role }));
        Cookies.set('token', token, { expires: 7 });

        return { user, token };
    } catch (error) {
        throw error.message;
    }
};

const logout = () => {
    Cookies.remove('token');
    localStorage.clear();
    sessionStorage.clear();
};

const getMe = async () => {
    try {
        await delay(500); // Simuler un délai réseau
        
        const token = Cookies.get('token');
        if (!token) {
            throw new Error('Non authentifié');
        }

        const { id } = JSON.parse(atob(token));
        const user = mockUsers.find(u => u.id === id);
        
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        return user;
    } catch (error) {
        throw error.message;
    }
};

const authService = {
    register,
    login,
    logout,
    getMe,
};

export default authService;