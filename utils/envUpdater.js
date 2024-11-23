const fs = require('fs');
const path = require('path');

const updateEnvFile = (newVariables) => {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    
    // Read existing .env content if file exists
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add new variables
    Object.entries(newVariables).forEach(([key, value]) => {
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (envContent.match(regex)) {
            envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
            envContent += `\n${key}=${value}`;
        }
    });

    // Write back to .env file
    fs.writeFileSync(envPath, envContent.trim());
};

module.exports = updateEnvFile;