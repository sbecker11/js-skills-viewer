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
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.innerHTML = generateHTML(skills);
        })
        .catch(error => console.error('Error loading skills:', error));
}

function parseCSV(data) {
    const lines = data.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }
        console.log(`obj: ${JSON.stringify(obj)}`);
        result.push(obj);
    }

    // group all skill-details by category and sort by decreasing skill-detail.age
    // compoute category years as max skill-detail years
    // sort categories alphabetically

    return result;
}

function generateHTML(skills) {
    const categories = {};

    skills.forEach(skill => {
        if (!categories[skill.category]) {
            categories[skill.category] = [];
        }
        categories[skill.category].push(skill);
    });

    let html = '';

    for (const category in categories) {
        html += `<div class="skill-category">`;
        html += `<div class="skill-bar">`;
        html += `<div class="skill-fill" style="width: ${categories[category][0].percentage}%;"></div>`;
        html += `<span class="skill-name">${category}</span>`;
        html += `<span class="skill-years">${categories[category][0].years} years</span>`;
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