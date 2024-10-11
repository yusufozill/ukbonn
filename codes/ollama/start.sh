#!/bin/sh

# Ollama uygulamasını başlat
ollama serve &

# Ollama'nın tam olarak başlatılması için bekle
sleep 5

# Mistral modelini yükle
ollama pull mistral
