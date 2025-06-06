import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockDeclarations } from '../../services/mockData';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import '../../styles/ReceiptGenerator.css';

dayjs.locale('fr');

function ReceiptGenerator() {
    const { id } = useParams();
    const [declaration, setDeclaration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDeclaration();
    }, [id]);

    const loadDeclaration = () => {
        try {
            const foundDeclaration = mockDeclarations.find(d => d.id === parseInt(id));
            if (!foundDeclaration) {
                throw new Error('Déclaration non trouvée');
            }
            setDeclaration(foundDeclaration);
            setError(null);
        } catch (err) {
            console.error('Erreur lors du chargement de la déclaration:', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="loading">Chargement de la déclaration...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!declaration) {
        return <div className="error">Déclaration non trouvée</div>;
    }

    return (
        <div className="receipt-container">
            <div className="receipt-header">
                <h1>Récépissé de Déclaration</h1>
                <p>N° {declaration.id}</p>
            </div>

            <div className="receipt-content">
                <div className="receipt-section">
                    <h2>Informations de la Déclaration</h2>
                    <p><strong>Type:</strong> {declaration.type}</p>
                    <p><strong>Date:</strong> {dayjs(declaration.date).format('DD/MM/YYYY')}</p>
                    <p><strong>Lieu:</strong> {declaration.location}</p>
                    <p><strong>Description:</strong> {declaration.description}</p>
                </div>

                {declaration.type === 'objet' && (
                    <div className="receipt-section">
                        <h2>Détails de l'Objet</h2>
                        <p><strong>Catégorie:</strong> {declaration.objectDetails?.category || 'Non spécifiée'}</p>
                        <p><strong>Nom:</strong> {declaration.objectDetails?.name || 'Non spécifié'}</p>
                        <p><strong>Marque:</strong> {declaration.objectDetails?.brand || 'Non spécifiée'}</p>
                    </div>
                )}

                {declaration.type === 'personne' && (
                    <div className="receipt-section">
                        <h2>Détails de la Personne</h2>
                        <p><strong>Nom:</strong> {declaration.personDetails?.lastName || 'Non spécifié'}</p>
                        <p><strong>Prénom:</strong> {declaration.personDetails?.firstName || 'Non spécifié'}</p>
                        <p><strong>Date de naissance:</strong> {declaration.personDetails?.dateOfBirth ? dayjs(declaration.personDetails.dateOfBirth).format('DD/MM/YYYY') : 'Non spécifiée'}</p>
                        <p><strong>Genre:</strong> {declaration.personDetails?.gender || 'Non spécifié'}</p>
                        <p><strong>Dernier lieu vu:</strong> {declaration.personDetails?.lastSeenLocation || declaration.location}</p>
                    </div>
                )}

                <div className="receipt-section">
                    <h2>Statut</h2>
                    <p><strong>État:</strong> {
                        declaration.status === 'pending' ? 'En attente' :
                        declaration.status === 'accepted' ? 'Acceptée' :
                        'Rejetée'
                    }</p>
                    {declaration.status === 'rejected' && declaration.rejectReason && (
                        <p><strong>Motif du rejet:</strong> {declaration.rejectReason}</p>
                    )}
                </div>
            </div>

            <div className="receipt-footer">
                <p>Ce document est un récépissé officiel de déclaration.</p>
                <p>Date d'émission: {dayjs().format('DD/MM/YYYY')}</p>
            </div>

            <div className="receipt-actions">
                <button onClick={handlePrint} className="btn-print">
                    Imprimer le récépissé
                </button>
            </div>
        </div>
    );
}

export default ReceiptGenerator; 