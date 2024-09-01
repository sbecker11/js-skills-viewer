document.addEventListener('DOMContentLoaded', () => {
    fetch('skills.csv')
        .then(response => response.text())
        .then(data => {
            const skills = parseCSV(data);
            const html = generateHTML(skills);
            document.getElementById('skills-container').innerHTML = html;
        })
        .catch(error => console.error('Error fetching the CSV file:', error));

    document.getElementById('dark-mode-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    document.getElementById('show-details-toggle').addEventListener('click', () => {
        document.querySelectorAll('.skill-details').forEach(details => {
            details.classList.toggle('hidden');
        });
    });
});

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const skills = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length === headers.length) {
            const skill = {};
            for (let j = 0; j < headers.length; j++) {
                skill[headers[j].trim()] = line[j].trim();
            }
            skills.push(skill);
        }
    }

    return skills;
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
        html += `
        <div class="skill-category">
            <div class="skill-bar">
                <div class="skill-fill" style="width: 75%;"></div>
                <span class="skill-name">${category}</span>
                <span class="skill-years">${categories[category][0].years} years</span>
            </div>
            <ul class="skill-details">
        `;

        categories[category].forEach(skill => {
            html += `
                <li><span class="skill-detail-name">${skill.skill}</span><span class="skill-detail-years">${skill.years}</span></li>
            `;
        });

        html += `
            </ul>
        </div>
        `;
    }

    return html;
}