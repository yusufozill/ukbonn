from flask import Flask, send_file

app = Flask(__name__)

@app.route('/')
def hello():
    return send_file('index.html')
@app.route('/words/<path:word_page>')
def serve_word_page(word_page):
    try:
        return send_file('word.html')
    except Exception as e:
        return str(e), 500  # Hata mesajını döner

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
