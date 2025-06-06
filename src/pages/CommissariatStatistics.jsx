import React, { useState, useEffect } from 'react';
import { FaChartBar, FaListAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { mockDeclarations } from '../services/mockData';
import '../styles/CommissariatDashboard.css';

function CommissariatStatistics() {
    const [statistics, setStatistics] = useState({
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        byType: {
            object: 0,
            person: 0
        }
    });

    useEffect(() => {
        // Calculer les statistiques à partir des données mockées
        const stats = {
            total: mockDeclarations.length,
            pending: mockDeclarations.filter(d => d.status === 'pending').length,
            accepted: mockDeclarations.filter(d => d.status === 'accepted').length,
            rejected: mockDeclarations.filter(d => d.status === 'rejected').length,
            byType: {
                object: mockDeclarations.filter(d => d.type === 'object').length,
                person: mockDeclarations.filter(d => d.type === 'person').length
            }
        };
        setStatistics(stats);
    }, []);

    return (
        <div className="commissariat-dashboard">
            <div className="dashboard-header">
                <h2>Statistiques des Déclarations</h2>
            </div>
            
            <div className="dashboard-content">
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <FaListAlt className="card-icon" />
                        <h3>Total des Déclarations</h3>
                        <p className="stat-number">{statistics.total}</p>
                    </div>

                    <div className="dashboard-card">
                        <FaChartBar className="card-icon" />
                        <h3>En Attente</h3>
                        <p className="stat-number">{statistics.pending}</p>
                    </div>

                    <div className="dashboard-card">
                        <FaCheckCircle className="card-icon" />
                        <h3>Acceptées</h3>
                        <p className="stat-number">{statistics.accepted}</p>
                    </div>

                    <div className="dashboard-card">
                        <FaTimesCircle className="card-icon" />
                        <h3>Rejetées</h3>
                        <p className="stat-number">{statistics.rejected}</p>
                    </div>
                </div>

                <div className="statistics-details">
                    <h3>Répartition par Type</h3>
                    <div className="type-stats">
                        <div className="type-stat">
                            <h4>Objets</h4>
                            <p>{statistics.byType.object}</p>
                        </div>
                        <div className="type-stat">
                            <h4>Personnes</h4>
                            <p>{statistics.byType.person}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommissariatStatistics; 