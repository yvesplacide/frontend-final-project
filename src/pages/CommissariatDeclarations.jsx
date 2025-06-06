import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockDeclarations } from '../services/mockData';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaList, FaChartBar, FaCog, FaBell } from 'react-icons/fa';
import NotificationCounter from '../components/common/NotificationCounter';
import ReceiptGenerator from '../components/declaration/ReceiptGenerator';
import '../styles/CommissariatDashboard.css';

dayjs.locale('fr');

function CommissariatDeclarations() {
    const { user } = useAuth();
    const [declarations, setDeclarations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDeclaration, setSelectedDeclaration] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        type: 'all',
        search: ''
    });
    const location = useLocation();

    const statusOptions = [
        'En attente',
        'Traité',
        'Refusée'
    ];

    const loadDeclarations = () => {
        try {
            if (!user || user.role !== 'commissariat_agent') {
                throw new Error('Accès non autorisé. Vous devez être un agent de commissariat.');
            }

            if (!user.commissariat) {
                throw new Error('Commissariat non assigné à cet agent');
            }

            // Filtrer les déclarations pour ce commissariat
            let filteredDeclarations = mockDeclarations.filter(decl => 
                decl.commissariatId === user.commissariat
            );

            // Appliquer les filtres
            if (filters.status !== 'all') {
                filteredDeclarations = filteredDeclarations.filter(decl => 
                    decl.status === filters.status
                );
            }

            if (filters.type !== 'all') {
                filteredDeclarations = filteredDeclarations.filter(decl => 
                    decl.type === filters.type
                );
            }

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredDeclarations = filteredDeclarations.filter(decl => 
                    decl.description?.toLowerCase().includes(searchLower) ||
                    decl.location?.toLowerCase().includes(searchLower) ||
                    decl.id.toString().includes(searchLower)
                );
            }

            setDeclarations(filteredDeclarations);
            setError(null);
        } catch (err) {
            console.error('Erreur lors du chargement des déclarations:', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadDeclarations();
        }
    }, [user, filters]);

    const handleStatusChange = async (declarationId, newStatus) => {
        try {
            // Mettre à jour le statut localement
            const updatedDeclarations = declarations.map(decl => 
                decl.id === declarationId 
                    ? { ...decl, status: newStatus }
                    : decl
            );
            setDeclarations(updatedDeclarations);
            toast.success('Statut mis à jour avec succès');
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut:', err);
            toast.error('Erreur lors de la mise à jour du statut');
        }
    };

    const handleReject = async (declarationId) => {
        try {
            if (!rejectReason.trim()) {
                toast.error('Veuillez fournir une raison de refus');
                return;
            }

            // Mettre à jour le statut localement
            const updatedDeclarations = declarations.map(decl => 
                decl.id === declarationId 
                    ? { ...decl, status: 'Refusée', rejectReason }
                    : decl
            );
            setDeclarations(updatedDeclarations);
            setShowRejectModal(false);
            setRejectReason('');
            toast.success('Déclaration refusée avec succès');
        } catch (err) {
            console.error('Erreur lors du refus de la déclaration:', err);
            toast.error('Erreur lors du refus de la déclaration');
        }
    };

    if (loading) {
        return <div className="loading">Chargement des déclarations...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="commissariat-declarations">
            <div className="filters">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="all">Tous les statuts</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                    <option value="all">Tous les types</option>
                    <option value="objet">Perte d'objet</option>
                    <option value="personne">Disparition de personne</option>
                </select>

                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
            </div>

            <div className="declarations-list">
                {declarations.length === 0 ? (
                    <p className="no-declarations">Aucune déclaration trouvée</p>
                ) : (
                    declarations.map(declaration => (
                        <div key={declaration.id} className="declaration-card">
                            <div className="declaration-header">
                                <h3>Déclaration #{declaration.id}</h3>
                                <span className={`status-${declaration.status.toLowerCase().replace(/\s/g, '-')}`}>
                                    {declaration.status}
                                </span>
                            </div>
                            <div className="declaration-content">
                                <p><strong>Type:</strong> {declaration.type === 'objet' ? 'Perte d\'objet' : 'Disparition de personne'}</p>
                                <p><strong>Date:</strong> {dayjs(declaration.declarationDate).format('DD/MM/YYYY HH:mm')}</p>
                                <p><strong>Lieu:</strong> {declaration.location}</p>
                                <p><strong>Description:</strong> {declaration.description}</p>
                            </div>
                            {declaration.status === 'En attente' && (
                                <div className="declaration-actions">
                                    <button
                                        onClick={() => handleStatusChange(declaration.id, 'Traité')}
                                        className="btn-accept"
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDeclaration(declaration);
                                            setShowRejectModal(true);
                                        }}
                                        className="btn-reject"
                                    >
                                        Refuser
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showRejectModal && selectedDeclaration && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Refuser la déclaration</h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Raison du refus..."
                            rows="4"
                        />
                        <div className="modal-actions">
                            <button onClick={() => handleReject(selectedDeclaration.id)}>Confirmer</button>
                            <button onClick={() => {
                                setShowRejectModal(false);
                                setRejectReason('');
                            }}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommissariatDeclarations; 