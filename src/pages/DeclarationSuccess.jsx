import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaUser } from 'react-icons/fa';
import '../styles/DeclarationSuccess.css';

const DeclarationSuccess = () => {
  return (
    <div className="declaration-success">
      <div className="success-content">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h1>Déclaration Effectuée avec Succès</h1>
        <p>
          Votre déclaration a été enregistrée avec succès. 
          Vous recevrez une notification une fois que votre déclaration sera traitée par le commissariat.
        </p>
        <div className="success-actions">
          <Link to="/" className="btn btn-primary">
            <FaHome /> Retour à l'accueil
          </Link>
          <Link to="/user-dashboard" className="btn btn-secondary">
            <FaUser /> Voir mes déclarations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeclarationSuccess; 