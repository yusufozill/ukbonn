FROM ollama/ollama

WORKDIR /app/models

EXPOSE 11434

CMD ["serve"]


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
