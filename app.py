from flask import Flask, Response, request, render_template, stream_with_context
import sqlite3
from flask_table import Table, Col
import socket
import jinja2
import os


class ItemTable(Table):
    name = Col('Name')
    score = Col('Score')

stringConnection = 'data.db'
appPath = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_url_path='/static')  # <-- url de los archivos


@app.route('/')
def index():
    conn = sqlite3.connect(stringConnection)
    cursor = conn.cursor()
    data = cursor.execute('SELECT name,score FROM scores;').fetchall()
    items = []
    for element in data:
        items.append(
            {'name': element[0], 'score': element[1]}
        )
    table = ItemTable(sorted(items,key=lambda i: i['score'],reverse=True))
    tableHtml = table.__html__()
    context = {'table': tableHtml}
    template = jinja2.Template(readHtml('templates/score.html'))
    return Response(template.render(context), mimetype='text/html')



@app.route('/game')
def game():
    return app.send_static_file('game.html')


def readHtml(URL):
    with open(URL) as fileHtml:
        return fileHtml.read()


@app.route('/addScore', methods=['POST'])
def addScore():
    conn = sqlite3.connect(stringConnection)
    cursor = conn.cursor()
    name = request.args.get('name')
    score = request.args.get('score')
    args = (name, score)
    cursor.execute('INSERT INTO scores (name,score) VALUES (?,?)', args)
    conn.commit()
    return 'sucessed'


if __name__ == "__main__":
    app.run('192.168.0.132', 5000)
