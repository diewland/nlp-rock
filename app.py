from flask import Flask, render_template, request, jsonify
from nlp_rock import *

app = Flask(__name__)

# prepare clients
lang_client = language.LanguageServiceClient()
tran_client = translate.Client()

# front
@app.route('/')
def hello():
    return render_template('index.html')

# process
def do_nlp_process(text):
    categories, text_en = classify_th(lang_client, tran_client, text)
    entities = get_entities_th(lang_client, tran_client, text)
    return categories, entities, text_en

# controller
@app.route('/nlp_rock', methods=['POST'])
def trible():
    text = request.json.get('text')
    classes, entities, text_en = do_nlp_process(text)
    return jsonify({
        'classes': classes,
        'entities': entities,
        'translate': text_en,
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
