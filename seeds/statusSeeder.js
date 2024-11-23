const Status = require('../models/status');
const updateEnvFile = require('../utils/envUpdater');

const statuses = [
    { label: 'Public' },
    { label: 'Private' },
    { label: 'Inactive' },
    { label: 'Draft' },
    { label: 'Deleted' },
    { label: 'Pending' }
];

const seedStatuses = async () => {
    try {
        await Status.deleteMany({});
        const createdStatuses = await Status.insertMany(statuses);
        
        // Store ObjectIds in environment variables
        const envUpdates = {};
        createdStatuses.forEach((status) => {
            const key = `STATUS_${status.label.toUpperCase().replace(' ', '_')}_ID`;
            envUpdates[key] = status._id.toString();
        });
        
        updateEnvFile(envUpdates);
        console.log('Statuses seeded successfully:', createdStatuses);
        return createdStatuses;
    } catch (error) {
        console.error('Error seeding statuses:', error);
        throw error;
    }
};

module.exports = seedStatuses;