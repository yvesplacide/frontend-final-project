import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/DeclarationSuccessPage.css';

function DeclarationSuccessPage() {
    const { user } = useAuth();

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="success-icon">✓</div>
                <h1>Déclaration Enregistrée avec Succès</h1>
                <p>Votre déclaration a été enregistrée avec succès. Vous recevrez une notification dès qu'il y aura une mise à jour.</p>
                
                <div className="success-actions">
                    <Link to="/user-dashboard" className="btn-primary">
                        Retour au tableau de bord
                    </Link>
                    <Link to="/declaration/new" className="btn-secondary">
                        Faire une nouvelle déclaration
                    </Link>
                </div>

                <div className="success-info">
                    <h3>Prochaines étapes :</h3>
                    <ul>
                        <li>Votre déclaration sera examinée par nos agents</li>
                        <li>Vous recevrez des notifications sur l'état de votre déclaration</li>
                        <li>Vous pouvez suivre l'état de votre déclaration dans votre tableau de bord</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DeclarationSuccessPage; 