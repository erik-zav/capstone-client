import got from 'got';
export async function getProfessors() {
    const response = await got('https://www.kent.edu/stark/computer-science-faculty');
    const html = response.body;
    return extractTeachersData(html);
}
export async function getLibrary() {
    const response = await got('https://www.kent.edu/stark/library');
    const html = response.body;
    return extractLibraryHours(html);
}
function extractLibraryHours(html) {
    const regex = /<strong>(Jan\.\s\d{1,2}\s-\sMay\s\d{1,2},\s\d{4}\*)<\/strong><br>\s*(.*?)<br>\s*(.*?)<br>\s*(.*?)<\/p>\s*<p><strong>(\*\w{5}\s\d{1,2}\s-\s\d{1,2}:\sSpring\sBreak)<\/strong><br>\s*(.*?)<br>/gms;
    const matches = regex.exec(html);
    if (matches && matches.length > 1) {
        let result = `${matches[1]}\n${matches[2]}\n${matches[3]}\n${matches[4]}\n\n${matches[5]}\n${matches[6]}`;
        return result;
    }
    else {
        return "No matching hours information found.";
    }
}
function extractTeachersData(html) {
    const nameTitleRegex = /<strong>([^<]+),\s*([^<]+)<\/strong>/g;
    const emailRegex = /mailto:([^"]+)/g;
    const phoneRegex = /\d{3}-\d{3}-\d{4}/g;
    const roomRegex = /(\d{3} Main Hall)/g;
    let matches, teachers = [];
    while ((matches = nameTitleRegex.exec(html)) !== null) {
        const emailMatch = emailRegex.exec(html);
        const phoneMatch = phoneRegex.exec(html);
        const roomMatch = roomRegex.exec(html);
        teachers.push({
            name: matches[1],
            title: matches[2],
            email: emailMatch ? emailMatch[1] : 'N/A',
            phone: phoneMatch ? phoneMatch[0] : 'N/A',
            room: roomMatch ? roomMatch[1] : 'N/A'
        });
    }
    return teachers;
}
//# sourceMappingURL=scraper.js.map