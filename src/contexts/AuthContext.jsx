// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

// Données de test pour les utilisateurs
const testUsers = [
    {
        id: 1,
        email: 'admin@test.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'Test',
        role: 'admin'
    },
    {
        id: 2,
        email: 'agent@test.com',
        password: 'agent123',
        firstName: 'Agent',
        lastName: 'Test',
        role: 'commissariat_agent',
        commissariat: 1
    },
    {
        id: 3,
        email: 'user@test.com',
        password: 'user123',
        firstName: 'User',
        lastName: 'Test',
        role: 'user'
    }
];

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialiser les utilisateurs de test si le localStorage est vide
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.length === 0) {
            localStorage.setItem('users', JSON.stringify(testUsers));
        }

        // Vérifier si l'utilisateur est déjà connecté
        const token = Cookies.get('token');
        if (token) {
            try {
                const userData = JSON.parse(atob(token));
                setUser(userData);
            } catch (error) {
                console.error('Erreur lors du décodage du token:', error);
                Cookies.remove('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Simuler un délai réseau
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Vérifier les identifiants dans le localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                throw new Error('Email ou mot de passe incorrect');
            }

            // Créer un token simple
            const token = btoa(JSON.stringify({
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                commissariat: user.commissariat
            }));

            // Stocker le token
            Cookies.set('token', token, { expires: 7 });
            setUser(user);

            toast.success('Connexion réussie !');
            navigate('/');
            return user;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            // Simuler un délai réseau
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Vérifier si l'email existe déjà
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(u => u.email === userData.email)) {
                throw new Error('Cet email est déjà utilisé');
            }

            // Créer un nouvel utilisateur
            const newUser = {
                id: Date.now(),
                ...userData,
                role: 'user'
            };

            // Sauvegarder l'utilisateur
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Créer un token
            const token = btoa(JSON.stringify({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }));

            // Stocker le token
            Cookies.set('token', token, { expires: 7 });
            setUser(newUser);

            toast.success('Inscription réussie !');
            navigate('/');
            return newUser;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        navigate('/');
        toast.success('Déconnexion réussie !');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;