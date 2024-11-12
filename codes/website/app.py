from flask import Flask, send_file
from flask_cors import CORS  # CORS modülünü ekleyin

app = Flask(__name__)
# Tüm rotalar için CORS'u etkinleştirir
@app.route('/')
def hello():
    return send_file('index.html')

# @app.route('/models/ollama.js')
# def ollamajs():
#     return send_file('models/ollama.js')

@app.route('/models/<path:jsPath>')
def sendjs(jsPath):
    try:
        return send_file(f'models/{jsPath}')  # Örneğin: some_path.html

    except Exception as e:
        return str(e), 500  # Hata mesajını döner
@app.route('/<path:adress>')
def index(adress):
    try:
        return send_file(f'html/{adress}.html')  # Örneğin: some_path.html

    except Exception as e:
        return str(e), 500  # Hata mesajını döner

@app.route('/icons/ollama.png')
def ollamapng():
    return send_file('icons/ollama.png')

@app.route('/words/<path:word_page>')
def serve_word_page(word_page):
    try:
        return send_file('word.html')

    except Exception as e:
        return str(e), 500  # Hata mesajını döner


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
