import six
from google.cloud import language
from google.cloud import translate
from google.cloud.language import enums
from google.cloud.language import types

def _translate(client, text, frm, to):
    text = text.strip()
    return client.translate(text, source_language=frm, target_language=to)['translatedText']

def translate_en_th(client, text):
    return _translate(client, text, 'en', 'th')

def translate_th_en(client, text):
    return _translate(client, text, 'th', 'en')

def get_entities(client, text):
    if isinstance(text, six.binary_type):
        text = text.decode('utf-8')

    # Instantiates a plain text document.
    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects entities in the document. You can also analyze HTML with:
    #   document.type == enums.Document.Type.HTML
    entities = client.analyze_entities(document).entities

    # return list of result
    return [
        {
            'name': entity.name,
            'type': enums.Entity.Type(entity.type).name,
            'salience': entity.salience,
            'wiki_url': entity.metadata.get('wikipedia_url', None),
            'mid': entity.metadata.get('mid', None),
        } for entity in entities
    ]

def get_entities_th(lang_client, translate_clint, text_th):
    # extract entities from text_en
    text_en = translate_th_en(translate_client, text)
    entities = get_entities(lang_client, text_en)
    return [
        {
            '_name': entity['name'],
            'name': translate_en_th(translate_client, entity['name']),
            'type': entity['type'],
        } for entity in entities
    ]

if __name__== "__main__":

    from pprint import pprint as pp

    text = """
จากกรณี ครูอ้อม นางสาวอ้อมอารีย์ แข็งฤทธิ์ อายุ 32 ปี ครูสอนนักเรียนชั้นอนุบาล 1 และอนุบาล 2 โรงเรียนวัดวงเดือน ต.สามง่ามท่าโบสถ์ อ.หันคา จ.ชัยนาท โพสต์ข้อความหลังถูกมือดีปาเลือดสดกระจายเต็มหน้าห้องเรียนที่สอนประจำชั้นกลัวว่าจะถูกปองร้าย จากที่ทนไม่ไหวเกี่ยวกับคุณภาพชีวิตของเด็กๆ ที่ได้กินอาหารกลางวัน มีสารอาหารไม่ครบ ออกมาเปิดเผยว่าเด็กกินมาม่า ไม่ได้กินผลไม้ หรือของมีประโยชน์เหมือนโรงเรียนอื่นๆ 
"""

    # prepare clients
    lang_client = language.LanguageServiceClient()
    translate_client = translate.Client()

    # extract entities
    result = get_entities_th(lang_client, translate_client, text)

    # show result
    print(text)
    for r in result:
        print("{:<20} | {} <== {}".format(r['type'], r['name'], r['_name']))
