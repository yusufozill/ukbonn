
async function searchArtikel(word) {
	word = toString(word).toLowerCase();
	if (word == "t-shirt") return "das";
	if (word == "u-bahn") return "die";
	word = word.charAt(0).toUpperCase() + word.slice(1);

	var request = new XMLHttpRequest();
	request.open('GET', 'https://der-artikel.de/der/' + word + '.html', true);
	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			if (request.status === 200) {
				return "der"
			} else {
				return searchDieArticle(word);
			}
		}
	};
	request.send();
}
async function searchDieArticle(word) {
	var request2 = new XMLHttpRequest();
	request2.open('GET', 'https://der-artikel.de/die/' + word + '.html', true);
	request2.onreadystatechange = function () {
		if (request2.readyState === 4) {
			if (request2.status === 200) {
				return "die";
			} else {
				return searchDasArticle(word);
			}
		}
	};
	request2.send();
}
async function searchDasArticle(word) {

	var request3 = new XMLHttpRequest();
	request3.open('GET', 'https://der-artikel.de/das/' + word + '.html', true);
	request3.onreadystatechange = function () {
		if (request3.readyState === 4) {
			if (request3.status === 200) {
				return "das";
			} else {
				return similarWord(word);
			}
		}
	};
	request3.send();
}
function deUmlaut(value) {
	value = value.toLowerCase();
	value = value.replace(/ä/g, 'a');
	value = value.replace(/ö/g, 'o');
	value = value.replace(/ü/g, 'u');
	value = value.replace(/ß/g, 's');
	return value;
}

async function similarWord(word) {
	word = word.toLowerCase();
	var request = new XMLHttpRequest();
	var wordWithoutUmlaut = deUmlaut(word);
	request.open('GET', "https://www.qmez.de:8444/v1/scanner/es/s?w=" + wordWithoutUmlaut, true);
	request.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {

			var result = this.responseText;
			if (result.length == 0) {
				word = word.charAt(0).toUpperCase() + word.slice(1);
				return "Substantiv »" + word + "« wurde nicht gefunden.";

			} else {
				var json = JSON.parse(result);
				w = json.word;
				a = json.article;
				return a;
			}
			//apiNotFoundWord(word.toLowerCase());
		}
	};
	request.send();
}
async function searchAdjective(word) {
	word = word.toLowerCase();
	try {
		const response = await fetch(`https://localhost:3000/search/adjectiv/${word}.html`);
		if (!response.ok) {
			return `Das Nomen »${word}« wurde nicht gefunden.`;
		}
		const text = await response.text();
		const result = text.split("<!-- About -->")[1].split("<!-- Services -->")[0];
		return result;
	} catch (error) {
		return `Fehler: ${error.message}`;
	}
}
async function searchNoun(article, word) {
	word = word.toLowerCase();
	var article = article.toLowerCase();

	if (word === "möchte") {
		word = "möchten";
	}
	try {
		const response = await fetch(`https://localhost:3000/search/${article}/${word}.html`);
		if (!response.ok) {
			return `Das Nomen »${word}« wurde nicht gefunden.`;
		}
		const text = await response.text();
		const result = text.split("<!-- About -->")[1].split("<!-- Services -->")[0];
		return result;
	} catch (error) {
		return `Fehler: ${error.message}`;
	}
}
async function searchVerb(word) {
	word = word.toLowerCase();

	try {
		const response = await fetch(`https://localhost:3000/search/verb/${word}.html`);
		if (!response.ok) {
			return `Das Nomen »${word}« wurde nicht gefunden.`;
		}
		const text = await response.text();
		const result = text.split("<!-- About -->")[1].split("<!-- Services -->")[0];
		return result;
	} catch (error) {
		return `Fehler: ${error.message}`;
	}
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

// Kullanıcıları listeleme fonksiyonu
async function listUsers() {

	var apiUrli = 'http://localhost:3000/users/';
	try {
		const response = await fetch(apiUrli);
		const users = await response.json();
		return JSON.stringify(users);

	} catch (error) {
		return error;
	}
}

// Kullanıcı silme fonksiyonu
async function deleteUser(userId) {
	userId = userId["user_id"];

	var apiUrli = 'http://localhost:3000/users/';
	try {
		const response = await fetch(`${apiUrli}${userId}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			return 'User deleted successfully';
		} else {
			const error = await response.json();
			return error;
		}
	} catch (error) {
		return 'Failed to delete user: '+ error;
	}
}