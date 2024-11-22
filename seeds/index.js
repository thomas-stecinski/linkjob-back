const mongoose = require('mongoose');
const seedRoles = require('./roleSeeder');
require('dotenv').config();

const runSeeders = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Run seeders
        await seedRoles();
        
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

runSeeders();