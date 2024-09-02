document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const detailsToggle = document.getElementById('show-details-toggle');
    const html = document.documentElement;

    // Load skills on page load
    loadSkills().then(() => {
        const skillDetails = document.querySelectorAll('.skill-details');
        console.log(`DOMContentLoaded skillDetails.length ${skillDetails.length}`);

        // Initial setup to ensure correct state
        skillDetails.forEach(detail => {
            detail.style.display = 'none';
        });
        detailsToggle.textContent = 'Show Skill Details';

        // Add event listeners after skillDetails are defined
        darkModeToggle.addEventListener('click', () => {
            html.classList.toggle('dark-mode');
            darkModeToggle.textContent = html.classList.contains('dark-mode') ? 'Toggle Light Mode' : 'Toggle Dark Mode';
        });

        detailsToggle.addEventListener('click', () => {
            console.log(`detailsToggle.clickListener: skillDetails.length ${skillDetails.length}`);
            const isHidden = skillDetails[0].style.display === 'none';

            skillDetails.forEach(detail => {
                detail.style.display = isHidden ? 'block' : 'none';
            });

            detailsToggle.textContent = isHidden ? 'Hide Skill Details' : 'Show Skill Details';
        });
    });

    const skillDetailNames = document.querySelectorAll('.skill-detail-name');
    for (let i = 0; i < skillDetailNames.length; i++) {
        console.log(`skillDetailNames[${i}]: ${skillDetailNames[i].textContent}`);
    }

});

function loadSkills() {
    return fetch('skills.csv')
        .then(response => response.text())
        .then(data => {
            const skills = parseCSV(data);
            const categories = categorizeSkills(skills);
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.innerHTML = generateHTML(categories);
        })
        .catch(error => console.error('Error loading skills:', error));
}

function parseCSV(data) {
    const lines = data.split('\n');
    const skillDetails = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }
        console.log(`obj: ${JSON.stringify(obj)}`);
        skillDetails.push(obj);
    }
    return skillDetails;
}

// returns an object/dict with categories as keys and 
// arrays of skillDetail objects as values
function categorizeSkills(skillDetails) {
    let categories = {};
    for ( let i = 0; i < skillDetails.length; i++) {
        let category = skillDetails[i].category;
        if (!Object.keys(categories).includes(category)) {
            categories[category] = [];
        }
        categories[category].push(skillDetails[i]);
    }
    // categories is an object/dict with values as Arrays of skillDetail objects.
    // In order to sort the array of skillDetail objects for each category
    // we create categoryArrays which is an Array of Arrays of skillDetail objects
    let categoryArrays = Object.values(categories); 
    for ( let i = 0; i < categoryArrays.length; i++) {
        // each categoryArray[i] is a category key value pair
        // Sort the array of skillDetail objects for this category
        categoryArrays[i].sort((a, b) => {
            return b.years - a.years;
        });
    }
    // Then use the sorted Array of skillDetail objects
    // to update the values for each category key in the 
    // original categories object/dict
    let categoryKeys = Object.keys(categories);
    for (let i = 0; i < categoryKeys.length; i++) {
        categories[categoryKeys[i]] = categoryArrays[i];
    }
    return categories;
}

function generateHTML(categories) {

    let html = '';

    for (const category in categories) {
        html += `<div class="skill-category">`;
        html += `<div class="skill-bar">`;
        html += `<div class="skill-fill" style="width: ${categories[category][0].percentage}%;"></div>`;
        html += `<span class="skill-name">${category}</span>`;
        html += `<span class="skill-years"> max ${categories[category][0].years} years</span>`;
        html += `</div>`;
        html += `<ul class="skill-details">`;

        categories[category].forEach(skill => {
            html += `<li><span class="skill-detail-name">${skill.skill}</span><span class="skill-detail-years">${skill.years} yrs</span></li>`;
        });

        html += `</ul>`;
        html += `</div>`;
    }

    return html;
}