
function deUmlaut(value) {
	value = value.toLowerCase();
	value = value.replace(/ä/g, 'a');
	value = value.replace(/ö/g, 'o');
	value = value.replace(/ü/g, 'u');
	value = value.replace(/ß/g, 's');
	return value;
}



async function getDateTime() {
	const now = new Date(); // Şu anki tarih ve saati al

	const hours = String(now.getHours()).padStart(2, '0');  // Saat
	const minutes = String(now.getMinutes()).padStart(2, '0');  // Dakika
	const seconds = String(now.getSeconds()).padStart(2, '0');  // Saniye

	return `${hours}:${minutes}:${seconds}`;  // Saat, dakika ve saniyeyi döndür
}
async function excuteCommand(command) {
	
	command = command["command"];
	console.log("Command:", command);
    const url = `http://localhost:3000/execute?command=${encodeURIComponent(command)}`;

    try {
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Result:", data);
		
		return JSON.stringify(data);
    } catch (error) {
        console.error("Error:", error);
		return {"Error": error.message};
    }
}

async function getRandomWords(numWords, masteredFilter = null, difficultyFilter = null) {
    let query = `SELECT * FROM learned_words WHERE 1=1`;
    
    // Öğrenme durumu filtresi
    if (masteredFilter !== null) {
        query += ` AND mastered = ${masteredFilter ? 1 : 0}`;
    }
    
    // Zorluk seviyesi filtresi (1-5 arası bir değer bekliyor)
    if (difficultyFilter !== null) {
        query += ` AND difficulty = ${difficultyFilter}`;
    }
    
    // Rastgele sıralama ve limit
    query += ` ORDER BY RAND() LIMIT ${numWords}`;
    
    // Komutu çalıştırmak için excuteCommand fonksiyonunu kullan
    const command = { command: query };
    const result = await excuteCommand(command);

    try {
        const parsedResult = JSON.parse(result);
        console.log("Random Words:", parsedResult);
        return parsedResult;
    } catch (error) {
        console.error("JSON Parse Error:", error);
        return { "Error": "JSON Parse Error" };
    }
}




async function addUser(info) {
	var mail = info["mail"];
	var user = info["user"];
	console.log("info:", info);

	var apiUrli = 'http://localhost:3000/users/';
	try {
		const response = await fetch(apiUrli, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({  user: user,mail: mail})
		});
		if (response.ok) {
			return 'User added successfully';
		} else {
			const error = await response.json();
			return "error: " + error;
		}
	} catch (error) {
		return 'Failed to add user: ' + JSON.stringify(error);
	}
}

