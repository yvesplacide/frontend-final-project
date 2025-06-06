// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockDeclarations } from '../services/mockData';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import '../styles/AdminDashboard.css';

dayjs.locale('fr');

function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [commissariats, setCommissariats] = useState([]);
    const [agents, setAgents] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les formulaires
    const [newCommissariat, setNewCommissariat] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: ''
    });

    const [newAgent, setNewAgent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        commissariatId: '',
        profession: '',
        address: '',
        dateOfBirth: '',
        birthPlace: ''
    });

    // Charger les données
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        try {
            if (!user || user.role !== 'admin') {
                throw new Error('Accès non autorisé. Vous devez être administrateur.');
            }

            // Filtrer les utilisateurs par rôle
            const regularUsers = mockUsers.filter(u => u.role === 'user');
            const agentUsers = mockUsers.filter(u => u.role === 'commissariat_agent');

            // Créer une liste de commissariats à partir des agents
            const commissariatsList = agentUsers.reduce((acc, agent) => {
                if (agent.commissariat && !acc.find(c => c.id === agent.commissariat)) {
                    acc.push({
                        id: agent.commissariat,
                        name: `Commissariat ${agent.commissariat}`,
                        address: 'Adresse du commissariat',
                        city: 'Ville du commissariat',
                        phone: '01 23 45 67 89',
                        email: `commissariat${agent.commissariat}@example.com`
                    });
                }
                return acc;
            }, []);

            setCommissariats(commissariatsList);
            setAgents(agentUsers);
            setUsers(regularUsers);
            setError(null);
        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Gestion des commissariats
    const handleCreateCommissariat = (e) => {
        e.preventDefault();
        try {
            const newCommissariatId = Date.now();
            const commissariat = {
                id: newCommissariatId,
                ...newCommissariat
            };

            setCommissariats([...commissariats, commissariat]);
            setNewCommissariat({
                name: '',
                address: '',
                city: '',
                phone: '',
                email: ''
            });
            toast.success('Commissariat créé avec succès');
        } catch (err) {
            console.error('Erreur lors de la création du commissariat:', err);
            toast.error('Erreur lors de la création du commissariat');
        }
    };

    const handleDeleteCommissariat = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commissariat ?')) {
            try {
                setCommissariats(commissariats.filter(c => c.id !== id));
                toast.success('Commissariat supprimé avec succès');
            } catch (err) {
                console.error('Erreur lors de la suppression du commissariat:', err);
                toast.error('Erreur lors de la suppression du commissariat');
            }
        }
    };

    // Gestion des agents
    const handleCreateAgent = (e) => {
        e.preventDefault();
        try {
            if (!newAgent.commissariatId) {
                toast.error('Veuillez sélectionner un commissariat');
                return;
            }

            const newAgentId = Date.now();
            const agent = {
                id: newAgentId,
                ...newAgent,
                role: 'commissariat_agent',
                commissariat: newAgent.commissariatId
            };

            setAgents([...agents, agent]);
            setNewAgent({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                commissariatId: '',
                profession: '',
                address: '',
                dateOfBirth: '',
                birthPlace: ''
            });
            toast.success('Agent créé avec succès');
        } catch (err) {
            console.error('Erreur lors de la création de l\'agent:', err);
            toast.error('Erreur lors de la création de l\'agent');
        }
    };

    const handleDeleteAgent = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
            try {
                setAgents(agents.filter(a => a.id !== id));
                toast.success('Agent supprimé avec succès');
            } catch (err) {
                console.error('Erreur lors de la suppression de l\'agent:', err);
                toast.error('Erreur lors de la suppression de l\'agent');
            }
        }
    };

    if (loading) {
        return <div className="loading">Chargement des données...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Tableau de Bord Administrateur</h2>
                <p>Bienvenue, {user?.firstName} !</p>
            </div>

            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    Vue d'ensemble
                </button>
                <button 
                    className={activeTab === 'commissariats' ? 'active' : ''}
                    onClick={() => setActiveTab('commissariats')}
                >
                    Commissariats
                </button>
                <button 
                    className={activeTab === 'agents' ? 'active' : ''}
                    onClick={() => setActiveTab('agents')}
                >
                    Agents
                </button>
                <button 
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Utilisateurs
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <div className="stats-cards">
                            <div className="stat-card">
                                <h3>Commissariats</h3>
                                <p>{commissariats.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Agents</h3>
                                <p>{agents.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Utilisateurs</h3>
                                <p>{users.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Déclarations</h3>
                                <p>{mockDeclarations.length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'commissariats' && (
                    <div className="commissariats-section">
                        <h3>Gestion des Commissariats</h3>
                        <form onSubmit={handleCreateCommissariat} className="form-section">
                            <h4>Nouveau Commissariat</h4>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Nom du commissariat"
                                    value={newCommissariat.name}
                                    onChange={(e) => setNewCommissariat(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Adresse"
                                    value={newCommissariat.address}
                                    onChange={(e) => setNewCommissariat(prev => ({ ...prev, address: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Ville"
                                    value={newCommissariat.city}
                                    onChange={(e) => setNewCommissariat(prev => ({ ...prev, city: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    placeholder="Téléphone"
                                    value={newCommissariat.phone}
                                    onChange={(e) => setNewCommissariat(prev => ({ ...prev, phone: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newCommissariat.email}
                                    onChange={(e) => setNewCommissariat(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary">Créer</button>
                        </form>

                        <div className="list-section">
                            <h4>Liste des Commissariats</h4>
                            {commissariats.length === 0 ? (
                                <p>Aucun commissariat enregistré</p>
                            ) : (
                                <div className="commissariats-list">
                                    {commissariats.map(commissariat => (
                                        <div key={commissariat.id} className="commissariat-card">
                                            <h5>{commissariat.name}</h5>
                                            <p><strong>Ville:</strong> {commissariat.city}</p>
                                            <p><strong>Adresse:</strong> {commissariat.address}</p>
                                            <p><strong>Téléphone:</strong> {commissariat.phone}</p>
                                            <p><strong>Email:</strong> {commissariat.email}</p>
                                            <button
                                                onClick={() => handleDeleteCommissariat(commissariat.id)}
                                                className="btn-delete"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'agents' && (
                    <div className="agents-section">
                        <h3>Gestion des Agents</h3>
                        <form onSubmit={handleCreateAgent} className="form-section">
                            <h4>Nouvel Agent</h4>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Prénom"
                                    value={newAgent.firstName}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, firstName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={newAgent.lastName}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, lastName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newAgent.email}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={newAgent.password}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    placeholder="Téléphone"
                                    value={newAgent.phone}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, phone: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={newAgent.commissariatId}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, commissariatId: e.target.value }))}
                                    required
                                >
                                    <option value="">Sélectionner un commissariat</option>
                                    {commissariats.map(commissariat => (
                                        <option key={commissariat.id} value={commissariat.id}>
                                            {commissariat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary">Créer</button>
                        </form>

                        <div className="list-section">
                            <h4>Liste des Agents</h4>
                            {agents.length === 0 ? (
                                <p>Aucun agent enregistré</p>
                            ) : (
                                <div className="agents-list">
                                    {agents.map(agent => (
                                        <div key={agent.id} className="agent-card">
                                            <h5>{agent.firstName} {agent.lastName}</h5>
                                            <p><strong>Email:</strong> {agent.email}</p>
                                            <p><strong>Téléphone:</strong> {agent.phone}</p>
                                            <p><strong>Commissariat:</strong> {
                                                commissariats.find(c => c.id === agent.commissariat)?.name || 'Non assigné'
                                            }</p>
                                            <button
                                                onClick={() => handleDeleteAgent(agent.id)}
                                                className="btn-delete"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-section">
                        <h3>Gestion des Utilisateurs</h3>
                        <div className="list-section">
                            {users.length === 0 ? (
                                <p>Aucun utilisateur enregistré</p>
                            ) : (
                                <div className="users-list">
                                    {users.map(user => (
                                        <div key={user.id} className="user-card">
                                            <h5>{user.firstName} {user.lastName}</h5>
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Téléphone:</strong> {user.phone || 'Non renseigné'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;