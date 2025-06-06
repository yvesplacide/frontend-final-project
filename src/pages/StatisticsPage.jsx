import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/StatisticsPage.css';

function StatisticsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalDeclarations: 0,
        pendingDeclarations: 0,
        resolvedDeclarations: 0,
        declarationsByType: {
            perte: 0,
            disparition: 0
        },
        declarationsByStatus: {
            en_cours: 0,
            traitee: 0,
            rejetee: 0
        }
    });

    useEffect(() => {
        // Simuler le chargement des statistiques
        const mockStats = {
            totalDeclarations: 150,
            pendingDeclarations: 45,
            resolvedDeclarations: 105,
            declarationsByType: {
                perte: 120,
                disparition: 30
            },
            declarationsByStatus: {
                en_cours: 45,
                traitee: 95,
                rejetee: 10
            }
        };
        setStats(mockStats);
    }, []);

    return (
        <div className="statistics-container">
            <h1>Tableau de Bord Statistique</h1>
            
            <div className="stats-grid">
                <div className="stat-card total">
                    <h3>Total des Déclarations</h3>
                    <div className="stat-value">{stats.totalDeclarations}</div>
                </div>
                
                <div className="stat-card pending">
                    <h3>En Attente</h3>
                    <div className="stat-value">{stats.pendingDeclarations}</div>
                </div>
                
                <div className="stat-card resolved">
                    <h3>Résolues</h3>
                    <div className="stat-value">{stats.resolvedDeclarations}</div>
                </div>
            </div>

            <div className="stats-details">
                <div className="stats-section">
                    <h2>Déclarations par Type</h2>
                    <div className="stats-chart">
                        <div className="chart-bar">
                            <div className="bar-label">Pertes</div>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ width: `${(stats.declarationsByType.perte / stats.totalDeclarations) * 100}%` }}
                                >
                                    {stats.declarationsByType.perte}
                                </div>
                            </div>
                        </div>
                        <div className="chart-bar">
                            <div className="bar-label">Disparitions</div>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ width: `${(stats.declarationsByType.disparition / stats.totalDeclarations) * 100}%` }}
                                >
                                    {stats.declarationsByType.disparition}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <h2>Statut des Déclarations</h2>
                    <div className="stats-chart">
                        <div className="chart-bar">
                            <div className="bar-label">En Cours</div>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ width: `${(stats.declarationsByStatus.en_cours / stats.totalDeclarations) * 100}%` }}
                                >
                                    {stats.declarationsByStatus.en_cours}
                                </div>
                            </div>
                        </div>
                        <div className="chart-bar">
                            <div className="bar-label">Traitées</div>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ width: `${(stats.declarationsByStatus.traitee / stats.totalDeclarations) * 100}%` }}
                                >
                                    {stats.declarationsByStatus.traitee}
                                </div>
                            </div>
                        </div>
                        <div className="chart-bar">
                            <div className="bar-label">Rejetées</div>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ width: `${(stats.declarationsByStatus.rejetee / stats.totalDeclarations) * 100}%` }}
                                >
                                    {stats.declarationsByStatus.rejetee}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatisticsPage; 