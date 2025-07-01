#!/bin/sh

# Start the Ollama server in background
ollama serve &

# waiting for server ready 
sleep 5

# Load llama3 into storage
ollama run llama3 &

# Load llava:7b into storage
ollama run llava:7b &

# Wait for all background processes
wait