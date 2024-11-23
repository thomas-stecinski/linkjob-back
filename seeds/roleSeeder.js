const mongoose = require('mongoose');
const Role = require('../models/role');
const updateEnvFile = require('../utils/envUpdater');

const roles = [
    {
        name: 'admin',
        permissions: [
            'manage_users',
            'manage_roles',
            'manage_jobs',
            'view_all',
            'edit_all',
            'delete_all'
        ],
        description: 'Administrator with full access'
    },
    {
        name: 'recruiter',
        permissions: [
            'create_job',
            'edit_own_job',
            'delete_own_job',
            'view_applications',
            'manage_own_profile'
        ],
        description: 'Recruiter who can post and manage jobs'
    },
    {
        name: 'user',
        permissions: [
            'view_jobs',
            'apply_jobs',
            'manage_own_profile',
            'view_own_applications'
        ],
        description: 'Regular user who can apply for jobs'
    }
];



const seedRoles = async () => {
    try {
        await Role.deleteMany({});
        const createdRoles = await Role.insertMany(roles);
        
        const envUpdates = {};
        createdRoles.forEach((role) => {
            const key = `ROLE_${role.name.toUpperCase()}_ID`;
            envUpdates[key] = role._id.toString();
        });
        
        updateEnvFile(envUpdates);
        console.log('Roles seeded successfully:', createdRoles);
        return createdRoles;
    } catch (error) {
        console.error('Error seeding roles:', error);
        throw error;
    }
};

module.exports = seedRoles;