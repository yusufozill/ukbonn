FROM ollama/ollama

# Çalışma dizinini belirle
WORKDIR /app/models

# start.sh script'ini container'a kopyala
COPY start.sh /app/start.sh

# start.sh dosyasına çalıştırma izni ver
RUN chmod +x /app/start.sh

# Portu expose et
EXPOSE 11434

# start.sh script'ini çalıştır
ENTRYPOINT ["/app/start.sh"]

# fetch('http://localhost:11434/api/chat', {
#   method: 'POST',
#   headers: {
#     'Content-Type': 'application/json'
#   },
#   body: JSON.stringify({
#     model: "llama3.2",
#     messages: [
#       {
#         role: "user",
#         content: "why is the sky blue?"
#       }
#     ],
#     stream: false
#   })
# })
#   .then(response => response.json())
#   .then(data => console.log(data))
#   .catch(error => console.error('Error:', error));
