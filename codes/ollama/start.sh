#!/bin/bash

# Ollama sunucusunu arka planda başlat
/bin/ollama serve &

# Ollama sunucusu çalışırken llama3.2 modelini indir
/bin/ollama pull llama3.2 
/bin/ollama run llama3.2 

# Sunucunun kapanmasını engellemek için beklet
wait
