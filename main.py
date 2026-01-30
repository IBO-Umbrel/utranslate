from easygoogletranslate import EasyGoogleTranslate
from flask import Flask , request
import emoji
import re
from auth import require_api_key

app = Flask(__name__)


@app.route("/translate", methods=['POST'])
@require_api_key
def translate():
    data = request.get_json()

    lined_text = data["text"].replace("\n", ":n:")
    converted_text = emoji.demojize(lined_text)
    seperated_texts = re.split(r"(:[^:]+:)", converted_text)
    # seperated_texts = [p for p in seperated_texts if p]

    translator = EasyGoogleTranslate(
        source_language=data["source"],
        target_language=data["target"],
        timeout=10
    )
    translation = ""

    for text in seperated_texts:
        if text:
            if text == ":n:":
                translation += "\n"
            elif text[0] == ":" and text[len(text)-1] == ":":
                translation += emoji.emojize(text)
            else:
                translation += str(translator.translate(text))
    return translation