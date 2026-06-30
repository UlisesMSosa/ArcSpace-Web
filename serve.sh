#!/bin/bash
# Inicia el servidor web para jugar ArcSpace en el navegador
# Abre http://localhost:8080/webarc-web/ en tu navegador

cd "$(dirname "$0")/.."
echo "Servidor iniciado en http://localhost:8080/webarc-web/"
echo "Presiona Ctrl+C para detener"
python3 -m http.server 8080
