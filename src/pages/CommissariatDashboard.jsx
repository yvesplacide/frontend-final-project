// frontend/src/pages/CommissariatDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockDeclarations } from '../services/mockData';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Importer la locale française pour dayjs
import '../styles/CommissariatDashboard.css'; // Import du CSS
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaListAlt } from 'react-icons/fa';
import NotificationCounter from '../components/common/NotificationCounter';
import ReceiptGenerator from '../components/declaration/ReceiptGenerator';
dayjs.locale('fr');

function CommissariatDashboard() {
    const { user, setUser } = useAuth();
    const [declarations, setDeclarations] = useState([]);
    const [rejectedDeclarations, setRejectedDeclarations] = useState([]);
    const [treatedDeclarations, setTreatedDeclarations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDeclaration, setSelectedDeclaration] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Détecter l'onglet actif en fonction de l'URL
    useEffect(() => {
        const path = location.pathname;
        if (path === '/commissariat-dashboard') {
            setActiveSidebarTab('dashboard');
        } else if (path === '/commissariat-dashboard/statistics') {
            setActiveSidebarTab('statistics');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!user || user.role !== 'commissariat_agent') {
            navigate('/login');
            return;
        }
        loadDeclarations();
    }, [user, navigate]);

    const loadDeclarations = () => {
        try {
            if (!user || user.role !== 'commissariat_agent') {
                throw new Error('Accès non autorisé. Vous devez être agent de commissariat.');
            }

            // Filtrer les déclarations pour ce commissariat
            const commissariatDeclarations = mockDeclarations.filter(
                d => d.commissariat === user.commissariat
            );

            setDeclarations(commissariatDeclarations);
            setError(null);
        } catch (err) {
            console.error('Erreur lors du chargement des déclarations:', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (declarationId, newStatus) => {
        try {
            const updatedDeclarations = declarations.map(d => {
                if (d.id === declarationId) {
                    return { ...d, status: newStatus };
                }
                return d;
            });
            setDeclarations(updatedDeclarations);
            toast.success(`Déclaration ${newStatus === 'accepted' ? 'acceptée' : 'rejetée'} avec succès`);
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err);
            toast.error('Erreur lors du changement de statut');
        }
    };

    const filteredDeclarations = declarations.filter(declaration => {
        const matchesFilter = filter === 'all' || declaration.status === filter;
        const matchesSearch = searchTerm === '' || 
            declaration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            declaration.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const openDetailsModal = (declaration) => {
        setSelectedDeclaration(declaration);
    };

    const closeDetailsModal = () => {
        setSelectedDeclaration(null);
    };

    const openPhotoModal = (photoUrl, e) => {
        e.stopPropagation(); // Empêche l'ouverture de la modal de détails
        setSelectedPhoto(photoUrl);
    };

    const closePhotoModal = () => {
        setSelectedPhoto(null);
    };

    const handleRejectDeclaration = async () => {
        if (!rejectReason.trim()) {
            toast.error('Veuillez saisir un motif de refus');
            return;
        }

        try {
            const updateData = {
                status: 'Refusée',
                rejectReason: rejectReason.trim(),
                agentAssigned: user._id,
                updatedAt: new Date().toISOString()
            };

            console.log('Envoi des données de refus:', updateData);

            const response = await api.put(`/declarations/${selectedDeclaration._id}/status`, updateData);

            if (response.data) {
                // Mettre à jour les listes de déclarations
                setDeclarations(prev => prev.filter(decl => decl._id !== selectedDeclaration._id));
                setRejectedDeclarations(prev => [...prev, response.data]);
                
                setShowRejectModal(false);
                setRejectReason('');
                setSelectedDeclaration(null);
                toast.success('Déclaration refusée avec succès');
            } else {
                throw new Error('Réponse invalide du serveur');
            }
        } catch (err) {
            console.error('Erreur lors du refus de la déclaration:', err);
            console.error('Détails de l\'erreur:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            toast.error(err.response?.data?.message || 'Erreur lors du refus de la déclaration');
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const renderContent = () => {
        switch (activeSidebarTab) {
            case 'dashboard':
                return (
                    <>
                        <h2>Tableau de Bord du Commissariat</h2>
                        {user && (
                            <div>
                                <p>Bienvenue, {user.firstName} !</p>
                                {user.commissariat && (
                                    <p>Vous gérez les déclarations du commissariat de {
                                        typeof user.commissariat === 'object' && user.commissariat !== null
                                            ? `${user.commissariat.name} (${user.commissariat.city})`
                                            : 'votre commissariat'
                                    }.</p>
                                )}
                            </div>
                        )}

                        <div className="dashboard-cards">
                            <div 
                                className="dashboard-card"
                                onClick={() => handleNavigation('/commissariat-declarations')}
                            >
                                <FaListAlt className="card-icon" />
                                <h3>Gérer les Déclarations</h3>
                                <p>Consultez et gérez les déclarations reçues</p>
                            </div>

                            <div 
                                className="dashboard-card"
                                onClick={() => handleNavigation('/commissariat-statistics')}
                            >
                                <FaChartBar className="card-icon" />
                                <h3>Voir les Statistiques</h3>
                                <p>Consultez les statistiques des déclarations</p>
                            </div>
                        </div>

                        <div className="dashboard-filters">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Rechercher une déclaration..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filter-buttons">
                                <button
                                    className={filter === 'all' ? 'active' : ''}
                                    onClick={() => setFilter('all')}
                                >
                                    Toutes
                                </button>
                                <button
                                    className={filter === 'pending' ? 'active' : ''}
                                    onClick={() => setFilter('pending')}
                                >
                                    En attente
                                </button>
                                <button
                                    className={filter === 'accepted' ? 'active' : ''}
                                    onClick={() => setFilter('accepted')}
                                >
                                    Acceptées
                                </button>
                                <button
                                    className={filter === 'rejected' ? 'active' : ''}
                                    onClick={() => setFilter('rejected')}
                                >
                                    Rejetées
                                </button>
                            </div>
                        </div>

                        <div className="declarations-list">
                            {filteredDeclarations.length === 0 ? (
                                <p className="no-declarations">Aucune déclaration trouvée</p>
                            ) : (
                                filteredDeclarations.map(declaration => (
                                    <div key={declaration.id} className="declaration-card">
                                        <div className="declaration-header">
                                            <h3>Déclaration #{declaration.id}</h3>
                                            <span className={`status ${declaration.status}`}>
                                                {declaration.status === 'pending' && 'En attente'}
                                                {declaration.status === 'accepted' && 'Acceptée'}
                                                {declaration.status === 'rejected' && 'Rejetée'}
                                            </span>
                                        </div>
                                        <div className="declaration-details">
                                            <p><strong>Type:</strong> {declaration.type}</p>
                                            <p><strong>Date:</strong> {dayjs(declaration.date).format('DD/MM/YYYY')}</p>
                                            <p><strong>Lieu:</strong> {declaration.location}</p>
                                            <p><strong>Description:</strong> {declaration.description}</p>
                                        </div>
                                        {declaration.status === 'pending' && (
                                            <div className="declaration-actions">
                                                <button
                                                    className="btn-accept"
                                                    onClick={() => handleStatusChange(declaration.id, 'accepted')}
                                                >
                                                    Accepter
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleStatusChange(declaration.id, 'rejected')}
                                                >
                                                    Rejeter
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                );
            case 'statistics':
                return (
                    <div className="statistics-container">
                        <h2>Statistiques</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total des déclarations</h3>
                                <p className="stat-number">{declarations.length + rejectedDeclarations.length + treatedDeclarations.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>En attente</h3>
                                <p className="stat-number">{declarations.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Refusées</h3>
                                <p className="stat-number">{rejectedDeclarations.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Traitées</h3>
                                <p className="stat-number">{treatedDeclarations.length}</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard commissariat-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                {user && user.commissariat && (
                    <div className="commissariat-info">
                        <h3>{
                            typeof user.commissariat === 'object' && user.commissariat !== null
                                ? user.commissariat.name
                                : 'Votre Commissariat'
                        }</h3>
                        <p>{
                            typeof user.commissariat === 'object' && user.commissariat !== null
                                ? user.commissariat.city
                                : ''
                        }</p>
                    </div>
                )}
                <nav>
                    <ul className="sidebar-menu">
                        <li>
                            <Link 
                                to="/commissariat-dashboard" 
                                className={`sidebar-link ${location.pathname === '/commissariat-dashboard' ? 'active' : ''}`}
                                onClick={() => setActiveSidebarTab('dashboard')}
                            >
                                <FaHome /> Tableau de bord
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/commissariat-dashboard/statistics" 
                                className={`sidebar-link ${location.pathname === '/commissariat-dashboard/statistics' ? 'active' : ''}`}
                                onClick={() => setActiveSidebarTab('statistics')}
                            >
                                <FaChartBar /> Statistiques
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Contenu principal */}
            <main className="dashboard-content">
                {renderContent()}
            </main>

            {/* Modal pour les détails de la déclaration */}
            {selectedDeclaration && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeDetailsModal}>&times;</button>
                        <h3>Détails de la Déclaration {selectedDeclaration.receiptNumber ? `: ${selectedDeclaration.receiptNumber}` : ''}</h3>
                        
                        <div className="details-section">
                            <h4>Informations Générales</h4>
                            <p><strong>Type:</strong> {selectedDeclaration.declarationType === 'objet' ? 'Perte d\'objet' : 'Disparition de personne'}</p>
                            {selectedDeclaration.declarationType === 'objet' && (
                                <>
                                    <p><strong>Catégorie:</strong> {selectedDeclaration.objectDetails?.objectCategory || 'Non spécifiée'}</p>
                                    <p><strong>Nom:</strong> {selectedDeclaration.objectDetails?.objectName || 'Non spécifié'}</p>
                                    <p><strong>Marque:</strong> {selectedDeclaration.objectDetails?.objectBrand || 'Non spécifiée'}</p>
                                </>
                            )}
                            {selectedDeclaration.declarationType === 'personne' && (
                                <>
                                    <p><strong>Nom:</strong> {selectedDeclaration.personDetails?.lastName || 'Non spécifié'}</p>
                                    <p><strong>Prénom:</strong> {selectedDeclaration.personDetails?.firstName || 'Non spécifié'}</p>
                                    <p><strong>Date de naissance:</strong> {selectedDeclaration.personDetails?.dateOfBirth ? dayjs(selectedDeclaration.personDetails.dateOfBirth).format('DD MMMM YYYY') : 'Non spécifiée'}</p>
                                    {selectedDeclaration.personDetails?.gender && <p><strong>Genre:</strong> {selectedDeclaration.personDetails.gender}</p>}
                                    <p><strong>Dernier lieu vu:</strong> {selectedDeclaration.personDetails?.lastSeenLocation || selectedDeclaration.location}</p>
                                </>
                            )}
                            <p><strong>Statut:</strong> {selectedDeclaration.status}</p>
                            {selectedDeclaration.status === 'Refusée' && selectedDeclaration.rejectReason && (
                                <p><strong>Motif du refus:</strong> {selectedDeclaration.rejectReason}</p>
                            )}
                            <p><strong>Date:</strong> {dayjs(selectedDeclaration.declarationDate).format('DD MMMM YYYY à HH:mm')}</p>
                            <p><strong>Lieu:</strong> {selectedDeclaration.location}</p>
                            <p><strong>Description:</strong> {selectedDeclaration.description}</p>
                        </div>

                        <div className="details-section">
                            <h4>Informations du Déclarant</h4>
                            <p><strong>Nom:</strong> {selectedDeclaration.user?.firstName} {selectedDeclaration.user?.lastName}</p>
                            <p><strong>Email:</strong> {selectedDeclaration.user?.email}</p>
                            <p><strong>Téléphone:</strong> {selectedDeclaration.user?.phone || 'Non renseigné'}</p>
                        </div>

                        {selectedDeclaration.declarationType === 'personne' && selectedDeclaration.personDetails && (
                            <div className="details-section">
                                <h4>Détails de la personne</h4>
                                <p><strong>Nom:</strong> {selectedDeclaration.personDetails.lastName}, <strong>Prénom:</strong> {selectedDeclaration.personDetails.firstName}</p>
                                <p><strong>Date de naissance:</strong> {dayjs(selectedDeclaration.personDetails.dateOfBirth).format('DD MMMM YYYY')}</p>
                                {selectedDeclaration.personDetails.gender && <p><strong>Genre:</strong> {selectedDeclaration.personDetails.gender}</p>}
                                {selectedDeclaration.personDetails.height && <p><strong>Taille:</strong> {selectedDeclaration.personDetails.height} cm</p>}
                                {selectedDeclaration.personDetails.weight && <p><strong>Poids:</strong> {selectedDeclaration.personDetails.weight} kg</p>}
                                {selectedDeclaration.personDetails.clothingDescription && <p><strong>Description des vêtements:</strong> {selectedDeclaration.personDetails.clothingDescription}</p>}
                                {selectedDeclaration.personDetails.distinguishingMarks && <p><strong>Signes particuliers:</strong> {selectedDeclaration.personDetails.distinguishingMarks}</p>}
                                {selectedDeclaration.personDetails.medicalConditions && <p><strong>Conditions médicales:</strong> {selectedDeclaration.personDetails.medicalConditions}</p>}
                                {selectedDeclaration.personDetails.contactInfo && <p><strong>Contact d'urgence:</strong> {selectedDeclaration.personDetails.contactInfo}</p>}
                                <p><strong>Dernier lieu vu:</strong> {selectedDeclaration.personDetails.lastSeenLocation || selectedDeclaration.location}</p>
                                {selectedDeclaration.personDetails.lastSeenDate && <p><strong>Dernière date de vue:</strong> {dayjs(selectedDeclaration.personDetails.lastSeenDate).format('DD MMMM YYYY à HH:mm')}</p>}
                            </div>
                        )}

                        {selectedDeclaration.commissariat && (
                            <div className="details-section">
                                <h4>Commissariat assigné</h4>
                                <p><strong>Nom:</strong> {selectedDeclaration.commissariat.name}</p>
                                <p><strong>Ville:</strong> {selectedDeclaration.commissariat.city}</p>
                                <p><strong>Adresse:</strong> {selectedDeclaration.commissariat.address}</p>
                                <p><strong>Email:</strong> {selectedDeclaration.commissariat.email}</p>
                                <p><strong>Téléphone:</strong> {selectedDeclaration.commissariat.phone}</p>
                            </div>
                        )}

                        {selectedDeclaration.photos && selectedDeclaration.photos.length > 0 && (
                            <div className="details-section">
                                <h4>Photos</h4>
                                <div className="photo-grid">
                                    {selectedDeclaration.photos.map((photo, index) => (
                                        <img 
                                            key={index} 
                                            src={`http://localhost:5000/uploads/${photo}`} 
                                            alt={`Photo ${index + 1}`} 
                                            className="declaration-photo"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openPhotoModal(`http://localhost:5000/uploads/${photo}`, e);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section du récépissé */}
                        <div className="receipt-section">
                            <h4>Récépissé Officiel</h4>
                            {selectedDeclaration.receiptNumber ? (
                                <div className="receipt-info">
                                    <p>Récépissé N° {selectedDeclaration.receiptNumber} établi le {dayjs(selectedDeclaration.receiptDate).format('DD/MM/YYYY')}</p>
                                    <p className="receipt-status">Le déclarant peut télécharger ce récépissé depuis son espace personnel</p>
                                </div>
                            ) : (
                                <div className="receipt-actions">
                                    <p>Établir un récépissé officiel pour cette déclaration</p>
                                    <ReceiptGenerator 
                                        declaration={selectedDeclaration} 
                                        onReceiptGenerated={(receiptNumber) => {
                                            const updatedDeclaration = {
                                                ...selectedDeclaration,
                                                receiptNumber,
                                                receiptDate: new Date().toISOString(),
                                                status: 'Traité',
                                                processedAt: new Date().toISOString()
                                            };

                                            // Mettre à jour les listes de déclarations
                                            setDeclarations(prev => prev.filter(decl => decl._id !== selectedDeclaration._id));
                                            setTreatedDeclarations(prev => [...prev, updatedDeclaration]);
                                            setSelectedDeclaration(updatedDeclaration);

                                            // Mettre à jour la déclaration dans la base de données
                                            api.put(`/declarations/${updatedDeclaration._id}`, updatedDeclaration)
                                                .then(() => {
                                                    toast.success('Déclaration traitée avec succès');
                                                    loadDeclarations(); // Recharger toutes les déclarations
                                                })
                                                .catch(error => {
                                                    console.error('Erreur lors de la mise à jour de la déclaration:', error);
                                                    toast.error('Erreur lors de la mise à jour de la déclaration');
                                                });
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Boutons d'action selon le statut */}
                        <div className="modal-footer">
                            {selectedDeclaration.status === 'En attente' && (
                                <button 
                                    className="btn reject-btn"
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    Refuser la déclaration
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmation de refus */}
            {showRejectModal && (
                <div className="modal-overlay">
                    <div className="modal-content reject-modal">
                        <button className="modal-close-btn" onClick={() => setShowRejectModal(false)}>&times;</button>
                        <h3>Refuser la déclaration</h3>
                        <p>Veuillez indiquer le motif du refus :</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Saisissez le motif du refus..."
                            rows="4"
                            className="reject-reason-input"
                        />
                        <div className="modal-actions">
                            <button 
                                className="btn cancel-btn"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Annuler
                            </button>
                            <button 
                                className="btn confirm-reject-btn"
                                onClick={handleRejectDeclaration}
                            >
                                Confirmer le refus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pour les photos en grand */}
            {selectedPhoto && (
                <div className="modal-overlay" onClick={closePhotoModal}>
                    <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closePhotoModal}>&times;</button>
                        <img src={selectedPhoto} alt="Photo en grand" className="full-size-photo" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommissariatDashboard;