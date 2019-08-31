import six
from google.cloud import language
from google.cloud import translate
from google.cloud.language import enums
from google.cloud.language import types
from google.api_core import exceptions

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

def get_entities_th(lang_client, tran_client, text_th):
    text_en = translate_th_en(tran_client, text)
    entities = get_entities(lang_client, text_en)
    return [
        {
            '_name': entity['name'],
            'name': translate_en_th(tran_client, entity['name']),
            'type': entity['type'],
        } for entity in entities
    ]

def classify(lang_client, text, verbose=False):
    try:
        document = language.types.Document(
            content=text,
            type=language.enums.Document.Type.PLAIN_TEXT)
        response = lang_client.classify_text(document)
        categories = response.categories
    except exceptions.InvalidArgument:
        # 400 Invalid text content: too few tokens (words) to process.
        return {}

    result = {}

    for category in categories:
        # Turn the categories into a dictionary of the form:
        # {category.name: category.confidence}, so that they can
        # be treated as a sparse vector.
        result[category.name] = category.confidence

    if verbose:
        print(text)
        for category in categories:
            print(u'=' * 20)
            print(u'{:<16}: {}'.format('category', category.name))
            print(u'{:<16}: {}'.format('confidence', category.confidence))

    return result

def classify_th(lang_client, tran_client, text_th, verbose=False):
    text_en = translate_th_en(tran_client, text_th)
    return classify(lang_client, text_en, verbose)

if __name__== "__main__":

    # TODO change your text here
    text = """
จากกรณี ครูอ้อม นางสาวอ้อมอารีย์ แข็งฤทธิ์ อายุ 32 ปี ครูสอนนักเรียนชั้นอนุบาล 1 และอนุบาล 2 โรงเรียนวัดวงเดือน ต.สามง่ามท่าโบสถ์ อ.หันคา จ.ชัยนาท โพสต์ข้อความหลังถูกมือดีปาเลือดสดกระจายเต็มหน้าห้องเรียนที่สอนประจำชั้นกลัวว่าจะถูกปองร้าย จากที่ทนไม่ไหวเกี่ยวกับคุณภาพชีวิตของเด็กๆ ที่ได้กินอาหารกลางวัน มีสารอาหารไม่ครบ ออกมาเปิดเผยว่าเด็กกินมาม่า ไม่ได้กินผลไม้ หรือของมีประโยชน์เหมือนโรงเรียนอื่นๆ 
    """

    from time import time
    from pprint import pprint as pp

    # start time
    start_time = time()

    # prepare clients
    lang_client = language.LanguageServiceClient()
    tran_client = translate.Client()

    # classify
    classify_result = classify_th(lang_client, tran_client, text)

    # extract entities
    result = get_entities_th(lang_client, tran_client, text)

    # show result
    print(text)
    pp(classify_result)
    print('')
    for r in result:
        print("{:<20} | {} <== {}".format(r['type'], r['name'], r['_name']))

    # show usage time
    print('\nTotal time : %.2f seconds' % (time() - start_time))
