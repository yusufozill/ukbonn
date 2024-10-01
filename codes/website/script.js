// Yeni kelime ekleme fonksiyonu
function addWord() {
    const word = document.getElementById('word').value;

    if (!word) {
        alert('Lütfen bir kelime girin');
        return;
    }

    fetch('http://localhost:3000/send', { // Port numarasını ekledik
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('word').value = ''; // Kelime alanını temizle
        loadWords(); // Kelime listesini güncelle
    })
    .catch(err => console.error('Hata:', err));
}

// Son 10 kelimeyi yükleme fonksiyonu
function loadWords() {
    fetch('http://localhost:3000/get') // Port numarasını ekledik
        .then(response => response.json())
        .then(data => {
            const wordList = document.getElementById('word-list');
            wordList.innerHTML = ''; // Mevcut listeyi temizle

            data.forEach(word => {
                const li = document.createElement('li');
                li.textContent = `${word.word} `;

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Sil';
                deleteBtn.onclick = () => deleteWord(word.id);

                li.appendChild(deleteBtn);
                wordList.appendChild(li);
            });
        })
        .catch(err => console.error('Hata:', err));
}

// Kelime silme fonksiyonu
function deleteWord(id) {
    fetch(`http://localhost:3000/delete/${id}`, { // Port numarasını ekledik
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        loadWords(); // Kelime listesini güncelle
    })
    .catch(err => console.error('Hata:', err));
}

// Sayfa yüklendiğinde kelimeleri getir
document.addEventListener('DOMContentLoaded', loadWords);
