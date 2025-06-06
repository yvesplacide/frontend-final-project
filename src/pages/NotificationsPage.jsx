import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockDeclarations } from '../services/mockData';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import '../styles/Notifications.css';

dayjs.locale('fr');

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadNotifications = () => {
            try {
                if (!user || !user.commissariat) {
                    throw new Error('Informations de commissariat non disponibles');
                }

                // Filtrer les déclarations en attente pour ce commissariat
                const pendingDeclarations = mockDeclarations.filter(decl => 
                    decl.status === 'En attente' && 
                    decl.commissariatId === user.commissariat
                );

                setNotifications(pendingDeclarations);
            } catch (error) {
                console.error('Erreur lors du chargement des notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
        // Mettre à jour toutes les 30 secondes
        const interval = setInterval(loadNotifications, 30000);

        return () => clearInterval(interval);
    }, [user]);

    if (loading) {
        return <div className="notifications-loading">Chargement des notifications...</div>;
    }

    if (!user || !user.commissariat) {
        return <div className="notifications-error">Vous n'avez pas accès aux notifications.</div>;
    }

    return (
        <div className="notifications-page">
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
                <p className="no-notifications">Aucune nouvelle notification</p>
            ) : (
                <div className="notifications-list">
                    {notifications.map(declaration => (
                        <div key={declaration.id} className="notification-item">
                            <h3>Nouvelle déclaration #{declaration.id}</h3>
                            <p>Type: {declaration.type}</p>
                            <p>Date: {dayjs(declaration.declarationDate).format('DD/MM/YYYY HH:mm')}</p>
                            <p>Statut: {declaration.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationsPage; 