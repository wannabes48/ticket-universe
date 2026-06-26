const fs = require('fs');
const path = require('path');

const stadiumsPath = path.join(__dirname, 'prisma/stadiums.json');
const stadiums = JSON.parse(fs.readFileSync(stadiumsPath, 'utf8'));

const nameMap = {
  "BC Place": "BC Place Vancouver",
  "BMO Field": "Toronto Stadium (BMO Field)",
  "Estadio Azteca": "Mexico City Stadium (Estadio Azteca)",
  "Estadio Akron": "Guadalajara Stadium (Estadio Akron)",
  "Estadio BBVA Bancomer": "Monterrey Stadium (Estadio BBVA)",
  "Mercedes-Benz Stadium": "Atlanta Stadium (Mercedes-Benz Stadium)",
  "Gillette Stadium": "Boston Stadium (Gillette Stadium)",
  "AT&T Stadium": "Dallas Stadium (AT&T Stadium)",
  "NRG Stadium": "Houston Stadium (NRG Stadium)",
  "Arrowhead Stadium": "Kansas City Stadium (Arrowhead Stadium)",
  "SoFi Stadium": "Los Angeles Stadium (SoFi Stadium)",
  "Hard Rock Stadium": "Miami Stadium (Hard Rock Stadium)",
  "MetLife Stadium": "New York New Jersey Stadium (MetLife Stadium)",
  "Lincoln Financial Field": "Philadelphia Stadium (Lincoln Financial Field)",
  "Levi's Stadium": "San Francisco Bay Area Stadium (Levi's Stadium)",
  "Lumen Field": "Seattle Stadium (Lumen Field)"
};

for (const stadium of stadiums) {
  if (nameMap[stadium.name]) {
    stadium.name = nameMap[stadium.name];
  }
}

fs.writeFileSync(stadiumsPath, JSON.stringify(stadiums, null, 2));
console.log('Successfully updated stadiums.json with FIFA names');
