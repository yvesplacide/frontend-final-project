import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import DeclarationForm from '../components/declaration/DeclarationForm';
import '../styles/NewDeclarationPage.css';

function NewDeclarationPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            
            // Simuler un délai réseau
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Créer une nouvelle déclaration
            const newDeclaration = {
                id: Date.now(),
                ...data,
                status: 'pending',
                createdAt: new Date().toISOString(),
                receiptNumber: `DEC-${Date.now()}`
            };

            // Stocker la déclaration dans le localStorage
            const declarations = JSON.parse(localStorage.getItem('declarations') || '[]');
            declarations.push(newDeclaration);
            localStorage.setItem('declarations', JSON.stringify(declarations));

            toast.success('Déclaration soumise avec succès !');
            navigate('/declaration-success', { state: { declaration: newDeclaration } });
        } catch (error) {
            console.error('Erreur lors de la soumission de la déclaration:', error);
            toast.error('Erreur lors de la soumission de la déclaration.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="new-declaration-page">
            <div className="page-header">
                <h2>Nouvelle Déclaration</h2>
                <p>Remplissez le formulaire ci-dessous pour déclarer une perte ou une disparition.</p>
            </div>
            <DeclarationForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
    );
}

export default NewDeclarationPage; 