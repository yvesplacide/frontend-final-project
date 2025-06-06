// frontend/src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockDeclarations } from '../services/mockData';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import DeclarationForm from '../components/declaration/DeclarationForm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/UserDashboard.css';

dayjs.locale('fr');

function UserDashboard() {
    const { user } = useAuth();
    const [declarations, setDeclarations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDeclaration, setSelectedDeclaration] = useState(null);
    const [showDeclarationForm, setShowDeclarationForm] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [activeFilter, setActiveFilter] = useState('pending');

    const loadUserDeclarations = () => {
        try {
            if (!user) {
                throw new Error('Utilisateur non connecté');
            }

            // Filtrer les déclarations de l'utilisateur
            const userDeclarations = mockDeclarations.filter(decl => 
                decl.userId === user.id
            );

            setDeclarations(userDeclarations);
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
        loadUserDeclarations();
    }, [user]);

    const openDetailsModal = (declaration) => {
        console.log('Déclaration complète:', declaration);
        console.log('Type de déclaration:', declaration.declarationType);
        if (declaration.declarationType === 'objet') {
            console.log('Détails de l\'objet:', declaration.objectDetails);
            console.log('Catégorie:', declaration.objectDetails?.objectCategory);
            console.log('Nom:', declaration.objectDetails?.objectName);
        } else if (declaration.declarationType === 'personne') {
            console.log('Détails de la personne:', declaration.personDetails);
            console.log('Nom:', declaration.personDetails?.lastName);
            console.log('Prénom:', declaration.personDetails?.firstName);
        }
        setSelectedDeclaration(declaration);
    };

    const closeDetailsModal = () => {
        setSelectedDeclaration(null);
    };

    const openPhotoModal = (photo) => {
        setSelectedPhoto(photo);
    };

    const closePhotoModal = () => {
        setSelectedPhoto(null);
    };

    const handleNewDeclaration = () => {
        setShowDeclarationForm(true);
    };

    const handleDeclarationSubmit = async (formData) => {
        try {
            // Créer une nouvelle déclaration
            const newDeclaration = {
                id: Date.now(),
                userId: user.id,
                ...formData,
                status: 'En attente',
                declarationDate: new Date().toISOString()
            };

            // Ajouter la déclaration à la liste
            setDeclarations(prev => [...prev, newDeclaration]);
            setShowDeclarationForm(false);
            toast.success('Déclaration soumise avec succès');
        } catch (err) {
            console.error('Erreur lors de la soumission de la déclaration:', err);
            toast.error('Erreur lors de la soumission de la déclaration');
        }
    };

    const handleDownloadReceipt = async (declaration) => {
        try {
            // Générer le PDF du récépissé
            const receiptElement = document.createElement('div');
            receiptElement.style.width = '210mm';
            receiptElement.style.padding = '20mm';
            receiptElement.style.backgroundColor = 'white';
            receiptElement.style.fontFamily = 'Arial, sans-serif';
            receiptElement.style.position = 'absolute';
            receiptElement.style.left = '-9999px';
            receiptElement.innerHTML = generateReceiptContent(declaration);

            document.body.appendChild(receiptElement);

            const canvas = await html2canvas(receiptElement, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`recepisse_officiel_${declaration.receiptNumber}.pdf`);

            document.body.removeChild(receiptElement);

            toast.success('Récépissé téléchargé');
        } catch (error) {
            console.error('Erreur lors du téléchargement du récépissé:', error);
            toast.error('Erreur lors du téléchargement du récépissé');
        }
    };

    const handleDeleteDeclaration = (declarationId) => {
        try {
            // Supprimer la déclaration localement
            setDeclarations(prev => prev.filter(decl => decl.id !== declarationId));
            toast.success('Déclaration supprimée avec succès');
        } catch (err) {
            console.error('Erreur lors de la suppression de la déclaration:', err);
            toast.error('Erreur lors de la suppression de la déclaration');
        }
    };

    const filteredDeclarations = declarations.filter(declaration => {
        switch (activeFilter) {
            case 'pending':
                return declaration.status === 'En attente';
            case 'completed':
                return declaration.status === 'Traité';
            case 'rejected':
                return declaration.status === 'Refusée';
            default:
                return true;
        }
    });

    if (loading) {
        return <div className="dashboard-loading">Chargement de vos déclarations...</div>;
    }

    if (error) {
        return <div className="dashboard-error">Erreur: {error}</div>;
    }

    return (
        <div className="dashboard user-dashboard">
            <div className="dashboard-header">
                <h2>Tableau de Bord</h2>
                <p>Bienvenue, {user?.firstName} ! Voici l'état de vos déclarations.</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total des déclarations</h3>
                    <div className="number">{declarations.length}</div>
                </div>
                <div className="stat-card">
                    <h3>En attente</h3>
                    <div className="number">
                        {declarations.filter(d => d.status === 'En attente').length}
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Traitées</h3>
                    <div className="number">
                        {declarations.filter(d => d.status === 'Traité').length}
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Refusées</h3>
                    <div className="number">
                        {declarations.filter(d => d.status === 'Refusée').length}
                    </div>
                </div>
            </div>

            <div className="dashboard-actions">
                <button 
                    className="btn-primary"
                    onClick={() => setShowDeclarationForm(true)}
                >
                    Nouvelle Déclaration
                </button>
            </div>

            <div className="filter-tabs">
                <button 
                    className={activeFilter === 'pending' ? 'active' : ''}
                    onClick={() => setActiveFilter('pending')}
                >
                    En attente
                </button>
                <button 
                    className={activeFilter === 'completed' ? 'active' : ''}
                    onClick={() => setActiveFilter('completed')}
                >
                    Traitées
                </button>
                <button 
                    className={activeFilter === 'rejected' ? 'active' : ''}
                    onClick={() => setActiveFilter('rejected')}
                >
                    Refusées
                </button>
            </div>

            <div className="declarations-list">
                {filteredDeclarations.length === 0 ? (
                    <p className="no-declarations">Aucune déclaration trouvée</p>
                ) : (
                    filteredDeclarations.map(declaration => (
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
                                        onClick={() => handleDeleteDeclaration(declaration.id)}
                                        className="btn-delete"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showDeclarationForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Nouvelle Déclaration</h3>
                        <DeclarationForm 
                            onSubmit={handleDeclarationSubmit}
                            isSubmitting={false}
                        />
                        <button 
                            className="btn-close"
                            onClick={() => setShowDeclarationForm(false)}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {selectedDeclaration && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeDetailsModal}>&times;</button>
                        <h3>Détails de la Déclaration</h3>
                        <div className="declaration-info">
                            <p><strong>Type:</strong> {selectedDeclaration.declarationType === 'objet' ? 'Perte d\'objet' : 'Disparition de personne'}</p>
                            <p><strong>Statut:</strong> {selectedDeclaration.status}</p>
                            {selectedDeclaration.status === 'Refusée' && selectedDeclaration.rejectReason && (
                                <div className="reject-reason">
                                    <strong>Motif du refus :</strong> {selectedDeclaration.rejectReason}
                                </div>
                            )}
                            <p><strong>Date:</strong> {dayjs(selectedDeclaration.declarationDate).format('DD MMMM YYYY à HH:mm')}</p>
                            <p><strong>Lieu:</strong> {selectedDeclaration.location}</p>
                            <p><strong>Description:</strong> {selectedDeclaration.description}</p>
                            <p><strong>Commissariat:</strong> {selectedDeclaration.commissariat?.name || 'Non assigné'}</p>

                            {/* Boutons d'action selon le statut */}
                            <div className="modal-footer">
                                {selectedDeclaration.status === 'Refusée' && (
                                    <button 
                                        onClick={() => handleDeleteDeclaration(selectedDeclaration.id)}
                                        className="btn delete-btn"
                                    >
                                        Supprimer la déclaration
                                    </button>
                                )}
                            </div>

                            {/* Détails spécifiques pour les objets perdus */}
                            {selectedDeclaration.declarationType === 'objet' && (
                                <div className="object-details">
                                    <h4>Détails de l'objet perdu</h4>
                                    <p><strong>Catégorie:</strong> {selectedDeclaration.objectDetails?.objectCategory || 'Non spécifiée'}</p>
                                    <p><strong>Nom:</strong> {selectedDeclaration.objectDetails?.objectName || 'Non spécifié'}</p>
                                    {selectedDeclaration.objectDetails?.objectBrand && (
                                        <p><strong>Marque:</strong> {selectedDeclaration.objectDetails.objectBrand}</p>
                                    )}
                                    {selectedDeclaration.objectDetails?.color && (
                                        <p><strong>Couleur:</strong> {selectedDeclaration.objectDetails.color}</p>
                                    )}
                                    {selectedDeclaration.objectDetails?.serialNumber && (
                                        <p><strong>Numéro de série:</strong> {selectedDeclaration.objectDetails.serialNumber}</p>
                                    )}
                                    {selectedDeclaration.objectDetails?.estimatedValue && (
                                        <p><strong>Valeur estimée:</strong> {selectedDeclaration.objectDetails.estimatedValue} €</p>
                                    )}
                                    {selectedDeclaration.objectDetails?.identificationMarks && (
                                        <p><strong>Signes particuliers:</strong> {selectedDeclaration.objectDetails.identificationMarks}</p>
                                    )}
                                </div>
                            )}

                            {/* Détails spécifiques pour les personnes disparues */}
                            {selectedDeclaration.declarationType === 'personne' && selectedDeclaration.personDetails && (
                                <div className="person-details">
                                    <h4>Détails de la personne disparue</h4>
                                    <p><strong>Nom:</strong> {selectedDeclaration.personDetails.lastName || 'Non spécifié'}</p>
                                    <p><strong>Prénom:</strong> {selectedDeclaration.personDetails.firstName || 'Non spécifié'}</p>
                                    <p><strong>Date de naissance:</strong> {selectedDeclaration.personDetails.dateOfBirth ? dayjs(selectedDeclaration.personDetails.dateOfBirth).format('DD MMMM YYYY') : 'Non spécifiée'}</p>
                                    <p><strong>Genre:</strong> {selectedDeclaration.personDetails.gender || 'Non spécifié'}</p>
                                    {selectedDeclaration.personDetails.height && (
                                        <p><strong>Taille:</strong> {selectedDeclaration.personDetails.height} cm</p>
                                    )}
                                    {selectedDeclaration.personDetails.weight && (
                                        <p><strong>Poids:</strong> {selectedDeclaration.personDetails.weight} kg</p>
                                    )}
                                    {selectedDeclaration.personDetails.clothingDescription && (
                                        <p><strong>Description des vêtements:</strong> {selectedDeclaration.personDetails.clothingDescription}</p>
                                    )}
                                    {selectedDeclaration.personDetails.lastSeenLocation && (
                                        <p><strong>Dernier lieu vu:</strong> {selectedDeclaration.personDetails.lastSeenLocation}</p>
                                    )}
                                    {selectedDeclaration.personDetails.distinguishingMarks && (
                                        <p><strong>Signes distinctifs:</strong> {selectedDeclaration.personDetails.distinguishingMarks}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedDeclaration.photos && selectedDeclaration.photos.length > 0 && (
                            <div className="photos-section">
                                <h4>Photos</h4>
                                <div className="photo-grid">
                                    {selectedDeclaration.photos.map((photo, index) => (
                                        <img 
                                            key={index} 
                                            src={`http://localhost:5000/uploads/${photo}`} 
                                            alt={`Photo ${index + 1}`} 
                                            className="declaration-photo"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section du récépissé */}
                        {selectedDeclaration.receiptNumber && (
                            <div className="receipt-section">
                                <h4>Récépissé Officiel</h4>
                                <div className="receipt-info">
                                    <p>Récépissé N° {selectedDeclaration.receiptNumber}</p>
                                    <p>Établi le {dayjs(selectedDeclaration.receiptDate).format('DD MMMM YYYY')}</p>
                                    <p>Traîté le {dayjs(selectedDeclaration.processedAt).format('DD MMMM YYYY à HH:mm')}</p>
                                    <button 
                                        onClick={() => handleDownloadReceipt(selectedDeclaration)}
                                        className="btn primary-btn"
                                    >
                                        Télécharger le récépissé
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedPhoto && (
                <div className="modal-overlay" onClick={closePhotoModal}>
                    <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closePhotoModal}>&times;</button>
                        <img 
                            src={`http://localhost:5000/uploads/${selectedPhoto}`} 
                            alt="Photo agrandie" 
                            className="enlarged-photo"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDashboard;