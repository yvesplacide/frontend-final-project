// frontend/src/components/declaration/DeclarationForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

function DeclarationForm({ onSubmit, isSubmitting }) {
    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
        defaultValues: {
            personDetails: {
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                height: '',
                weight: '',
                clothingDescription: '',
                lastSeenLocation: '',
                distinguishingMarks: ''
            }
        }
    });
    const declarationType = watch('declarationType');

    const handleFormSubmit = async (data) => {
        try {
            // Vérifier les données de la personne
            if (data.declarationType === 'personne') {
                if (!data.personDetails.firstName || !data.personDetails.lastName) {
                    throw new Error('Le nom et le prénom sont requis');
                }
            }

            // Ajuster la date pour le format ISO
            data.declarationDate = dayjs(data.declarationDate).toISOString();

            // Appeler la fonction onSubmit passée en props
            await onSubmit(data);
            reset();
        } catch (error) {
            console.error('Erreur lors de la soumission de la déclaration:', error);
            toast.error(error.message || 'Erreur lors de la soumission de la déclaration.');
        }
    };

    return (
        <div className="declaration-form-container">
            <h3>Faire une nouvelle déclaration</h3>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="declaration-form">
                <div className="form-group">
                    <label htmlFor="declarationType">Type de déclaration</label>
                    <select
                        id="declarationType"
                        {...register('declarationType', { required: 'Le type de déclaration est requis' })}
                        defaultValue=""
                        className="form-control"
                    >
                        <option value="">Sélectionner un type</option>
                        <option value="objet">Perte d'objet</option>
                        <option value="personne">Perte de personne</option>
                    </select>
                    {errors.declarationType && <span className="error-message">{errors.declarationType.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="declarationDate">Date de la perte/disparition</label>
                    <div className="date-input-container">
                        <input
                            type="datetime-local"
                            id="declarationDate"
                            {...register('declarationDate', { required: 'La date est requise' })}
                            max={dayjs().format('YYYY-MM-DDTHH:mm')}
                            className="form-control"
                        />
                    </div>
                    {errors.declarationDate && <span className="error-message">{errors.declarationDate.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="location">Lieu de la perte/disparition</label>
                    <input
                        type="text"
                        id="location"
                        {...register('location', { required: 'Le lieu est requis' })}
                        className="form-control"
                        placeholder="Entrez le lieu de la perte/disparition"
                    />
                    {errors.location && <span className="error-message">{errors.location.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description détaillée</label>
                    <textarea
                        id="description"
                        rows="5"
                        {...register('description', { required: 'La description est requise' })}
                        className="form-control"
                        placeholder="Décrivez en détail la perte ou la disparition..."
                    ></textarea>
                    {errors.description && <span className="error-message">{errors.description.message}</span>}
                </div>

                {/* Champs conditionnels basés sur le type de déclaration */}
                {declarationType === 'objet' && (
                    <div className="object-details">
                        <h4>Détails de l'objet</h4>
                        <div className="form-group">
                            <label htmlFor="objectDetails.objectCategory">Catégorie</label>
                            <select
                                id="objectDetails.objectCategory"
                                {...register('objectDetails.objectCategory', { required: 'La catégorie est requise' })}
                                className="form-control"
                            >
                                <option value="">Sélectionner une catégorie</option>
                                <optgroup label="Documents administratifs">
                                    <option value="cni">Carte Nationale d'Identité (CNI)</option>
                                    <option value="passeport">Passeport</option>
                                    <option value="certificat_nationalite">Certificat de nationalité</option>
                                    <option value="acte_naissance">Acte de naissance</option>
                                    <option value="carte_electeur">Carte d'électeur</option>
                                    <option value="permis_conduire">Permis de conduire</option>
                                    <option value="carte_consulaire">Carte consulaire</option>
                                    <option value="casier_judiciaire">Extrait de casier judiciaire</option>
                                </optgroup>
                                <optgroup label="Documents professionnels / scolaires">
                                    <option value="carte_professionnelle">Carte professionnelle</option>
                                    <option value="carte_etudiant">Carte d'étudiant ou scolaire</option>
                                    <option value="diplomes">Diplômes ou relevés de notes</option>
                                    <option value="ordre_mission">Ordres de mission</option>
                                </optgroup>
                                <optgroup label="Documents bancaires / financiers">
                                    <option value="carte_bancaire">Carte bancaire</option>
                                    <option value="carnet_cheques">Carnet de chèques</option>
                                    <option value="bordereaux">Bordereaux de dépôt ou de retrait</option>
                                    <option value="recus_transfert">Reçus de transfert d'argent</option>
                                </optgroup>
                                <optgroup label="Objets personnels">
                                    <option value="telephone">Téléphone portable</option>
                                    <option value="sac">Sac ou sac à main</option>
                                    <option value="cles">Clés (de maison, de voiture, etc.)</option>
                                    <option value="ordinateur">Ordinateur portable</option>
                                    <option value="montre_bijoux">Montre ou bijoux de valeur</option>
                                </optgroup>
                                <optgroup label="Véhicules">
                                    <option value="carte_grise">Carte grise (certificat d'immatriculation)</option>
                                    <option value="assurance_vehicule">Assurance véhicule</option>
                                    <option value="plaque_immatriculation">Plaque d'immatriculation</option>
                                </optgroup>
                                <optgroup label="Autres objets ou documents">
                                    <option value="badge_acces">Badge d'accès (entreprise, résidence)</option>
                                    <option value="carnet_sante">Carnet de santé</option>
                                    <option value="certificat_travail">Certificat de travail</option>
                                    <option value="contrat">Contrat de bail ou d'assurance</option>
                                </optgroup>
                            </select>
                            {errors.objectDetails?.objectCategory && <span className="error-message">{errors.objectDetails.objectCategory.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="objectDetails.objectName">Nom spécifique de l'objet</label>
                            <input
                                type="text"
                                id="objectDetails.objectName"
                                {...register('objectDetails.objectName', { required: 'Le nom de l\'objet est requis' })}
                                className="form-control"
                                placeholder="Ex: iPhone 13, Sac à dos Nike, etc."
                            />
                            {errors.objectDetails?.objectName && <span className="error-message">{errors.objectDetails.objectName.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="objectDetails.objectBrand">Marque (optionnel)</label>
                            <input
                                type="text"
                                id="objectDetails.objectBrand"
                                {...register('objectDetails.objectBrand')}
                                className="form-control"
                                placeholder="Ex: Apple, Samsung, Nike, etc."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="objectDetails.color">Couleur (optionnel)</label>
                            <input
                                type="text"
                                id="objectDetails.color"
                                {...register('objectDetails.color')}
                                className="form-control"
                                placeholder="Ex: Noir, Rouge, etc."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="objectDetails.serialNumber">Numéro de série ou référence (optionnel)</label>
                            <input
                                type="text"
                                id="objectDetails.serialNumber"
                                {...register('objectDetails.serialNumber')}
                                className="form-control"
                                placeholder="Ex: Numéro de série, référence du document, etc."
                            />
                        </div>
                    </div>
                )}

                {declarationType === 'personne' && (
                    <div className="person-details">
                        <h4>Détails de la personne disparue</h4>
                        <div className="form-group">
                            <label htmlFor="personDetails.firstName">Prénom</label>
                            <input
                                type="text"
                                id="personDetails.firstName"
                                {...register('personDetails.firstName', { 
                                    required: 'Le prénom est requis',
                                    onChange: (e) => setValue('personDetails.firstName', e.target.value)
                                })}
                                className="form-control"
                            />
                            {errors.personDetails?.firstName && <span className="error-message">{errors.personDetails.firstName.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personDetails.lastName">Nom</label>
                            <input
                                type="text"
                                id="personDetails.lastName"
                                {...register('personDetails.lastName', { 
                                    required: 'Le nom est requis',
                                    onChange: (e) => setValue('personDetails.lastName', e.target.value)
                                })}
                                className="form-control"
                            />
                            {errors.personDetails?.lastName && <span className="error-message">{errors.personDetails.lastName.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personDetails.dateOfBirth">Date de naissance</label>
                            <input
                                type="date"
                                id="personDetails.dateOfBirth"
                                {...register('personDetails.dateOfBirth', { required: 'La date de naissance est requise' })}
                                className="form-control"
                            />
                            {errors.personDetails?.dateOfBirth && <span className="error-message">{errors.personDetails.dateOfBirth.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personDetails.gender">Genre</label>
                            <select
                                id="personDetails.gender"
                                {...register('personDetails.gender', { required: 'Le genre est requis' })}
                                className="form-control"
                            >
                                <option value="">Sélectionner</option>
                                <option value="homme">Homme</option>
                                <option value="femme">Femme</option>
                                <option value="autre">Autre</option>
                            </select>
                            {errors.personDetails?.gender && <span className="error-message">{errors.personDetails.gender.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personDetails.height">Taille (cm)</label>
                            <input
                                type="number"
                                id="personDetails.height"
                                {...register('personDetails.height', { required: 'La taille est requise' })}
                                className="form-control"
                                min="0"
                                max="300"
                            />
                            {errors.personDetails?.height && <span className="error-message">{errors.personDetails.height.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personDetails.weight">Poids (kg)</label>
                            <input
                                type="number"
                                id="personDetails.weight"
                                {...register('personDetails.weight', { required: 'Le poids est requis' })}
                                className="form-control"
                                min="0"
                                max="500"
                            />
                            {errors.personDetails?.weight && <span className="error-message">{errors.personDetails.weight.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personDetails.clothingDescription">Description des vêtements</label>
                            <textarea
                                id="personDetails.clothingDescription"
                                {...register('personDetails.clothingDescription', { required: 'La description des vêtements est requise' })}
                                className="form-control"
                                placeholder="Décrivez les vêtements portés par la personne au moment de sa disparition"
                            />
                            {errors.personDetails?.clothingDescription && <span className="error-message">{errors.personDetails.clothingDescription.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personDetails.distinguishingMarks">Signes particuliers</label>
                            <textarea
                                id="personDetails.distinguishingMarks"
                                {...register('personDetails.distinguishingMarks')}
                                className="form-control"
                                placeholder="Cicatrices, tatouages, particularités physiques..."
                            />
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Envoi en cours...' : 'Soumettre la déclaration'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DeclarationForm;