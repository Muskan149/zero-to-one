import axios from 'axios';

export async function checkLink(url) {
    try {
        const response = await axios.head(url, {
            timeout: 5000, // 5 second timeout
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Consider 2xx and 3xx as valid
            }
        });
        return { url, status: response.status, valid: true };
    } catch (error) {
        return { url, status: error.response?.status || 'ERROR', valid: false };
    }
}

export async function checkAllLinks(linksData) {
    try {
        if (!linksData || typeof linksData !== 'object') {
            throw new Error('Invalid links data provided');
        }
        
        // Create a map to store validation results for each URL
        const validationResults = new Map();
        
        // Get all unique URLs
        const allUrls = [...new Set(Object.values(linksData).flat())];
        
        // Check each unique URL
        const results = await Promise.all(allUrls.map(checkLink));
        
        // Store results in the map
        results.forEach(result => {
            validationResults.set(result.url, result.valid);
        });

        // Create new object maintaining original structure
        const validLinks = {};
        
        // Process each step
        for (const [step, urls] of Object.entries(linksData)) {
            // Filter only valid URLs for this step
            const validUrls = urls.filter(url => validationResults.get(url));
            
            // Only add the step if it has valid URLs
            if (validUrls.length > 0) {
                validLinks[step] = validUrls;
            }
        }

        return validLinks;
    } catch (error) {
        console.error('Error checking links:', error);
        throw error;
    }
}

checkAllLinks();