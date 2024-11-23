const dotenv = require('dotenv');
dotenv.config();

const mapStatus = (status_label) => {
    switch (status_label.toLowerCase()) {
        case 'public':
            return process.env.STATUS_PUBLIC_ID;
        case 'private':
            return process.env.STATUS_PRIVATE_ID;
        case 'inactive':
            return process.env.STATUS_INACTIVE_ID;
        case 'draft':
            return process.env.STATUS_DRAFT_ID;
        case 'deleted':
            return process.env.STATUS_DELETED_ID;
        case 'pending':
            return process.env.STATUS_PENDING_ID;
        default:
            return process.env.STATUS_DRAFT_ID; // Default to draft if status not found
    }
};

module.exports = mapStatus;
