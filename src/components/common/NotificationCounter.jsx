import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockDeclarations } from '../../services/mockData';

function NotificationCounter() {
    const [count, setCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const updateNotificationCount = () => {
            if (!user || user.role !== 'commissariat_agent') {
                return;
            }

            // Filtrer les déclarations en attente pour ce commissariat
            const pendingDeclarations = mockDeclarations.filter(decl => 
                decl.status === 'En attente' && 
                decl.commissariatId === user.commissariat
            );

            setCount(pendingDeclarations.length);
        };

        updateNotificationCount();
        // Mettre à jour toutes les 30 secondes
        const interval = setInterval(updateNotificationCount, 30000);

        return () => clearInterval(interval);
    }, [user]);

    if (!user || user.role !== 'commissariat_agent' || count === 0) {
        return null;
    }

    return (
        <div className="notification-counter">
            <span className="notification-badge">{count}</span>
        </div>
    );
}

export default NotificationCounter; 