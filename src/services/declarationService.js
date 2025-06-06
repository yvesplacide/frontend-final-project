import { mockDeclarations, delay } from './mockData';

// Simuler le stockage local des déclarations
let declarations = [...mockDeclarations];

const getDeclarations = async (userId = null) => {
    await delay(500);
    if (userId) {
        return declarations.filter(d => d.userId === userId);
    }
    return declarations;
};

const getDeclaration = async (id) => {
    await delay(500);
    const declaration = declarations.find(d => d.id === id);
    if (!declaration) {
        throw new Error('Déclaration non trouvée');
    }
    return declaration;
};

const createDeclaration = async (declarationData) => {
    await delay(500);
    const newDeclaration = {
        id: declarations.length + 1,
        ...declarationData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    declarations.push(newDeclaration);
    return newDeclaration;
};

const updateDeclaration = async (id, updates) => {
    await delay(500);
    const index = declarations.findIndex(d => d.id === id);
    if (index === -1) {
        throw new Error('Déclaration non trouvée');
    }
    declarations[index] = { ...declarations[index], ...updates };
    return declarations[index];
};

const deleteDeclaration = async (id) => {
    await delay(500);
    const index = declarations.findIndex(d => d.id === id);
    if (index === -1) {
        throw new Error('Déclaration non trouvée');
    }
    declarations = declarations.filter(d => d.id !== id);
    return true;
};

const declarationService = {
    getDeclarations,
    getDeclaration,
    createDeclaration,
    updateDeclaration,
    deleteDeclaration
};

export default declarationService; 