import { mockNotifications, delay } from './mockData';

// Simuler le stockage local des notifications
let notifications = [...mockNotifications];

const getNotifications = async (userId) => {
    await delay(500);
    return notifications.filter(n => n.userId === userId);
};

const createNotification = async (notificationData) => {
    await delay(500);
    const newNotification = {
        id: notifications.length + 1,
        ...notificationData,
        read: false,
        createdAt: new Date().toISOString()
    };
    notifications.push(newNotification);
    return newNotification;
};

const markAsRead = async (id) => {
    await delay(500);
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
        throw new Error('Notification non trouvée');
    }
    notifications[index] = { ...notifications[index], read: true };
    return notifications[index];
};

const markAllAsRead = async (userId) => {
    await delay(500);
    notifications = notifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
    );
    return notifications.filter(n => n.userId === userId);
};

const deleteNotification = async (id) => {
    await delay(500);
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
        throw new Error('Notification non trouvée');
    }
    notifications = notifications.filter(n => n.id !== id);
    return true;
};

const notificationService = {
    getNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
};

export default notificationService; 