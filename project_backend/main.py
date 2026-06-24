from flask import Flask, request
from flask_restful import Api, Resource, abort, reqparse
from flask_sqlalchemy import SQLAlchemy
import json
from flask_cors import CORS
from docxtpl import DocxTemplate
import pathlib
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
api = Api(app)
CORS(app)

db = SQLAlchemy(app)
app.app_context().push()

video_put_args = reqparse.RequestParser()
video_put_args.add_argument("test", type=str)

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  uin = db.Column(db.Integer)
  questions = db.Column(db.Text)
  passed = db.Column(db.Integer)
  ticket = db.Column(db.Integer)
  answer_order = db.Column(db.String(20), nullable=False, default='random')
  test_answer_order = db.Column(db.String(20), nullable=False, default='random')
  prakt_answer_order = db.Column(db.String(20), nullable=False, default='random')
  tem_answer_order = db.Column(db.String(20), nullable=False, default='random')

  def __repr__(self):
    return f'id:{self.id}, uin:{self.uin}, questions:{self.questions}'

class Api(Resource):
  def get(self, uin):
    result = User.query.filter_by(uin=uin).first()
    if not result:
      abort(404, message="Could not find this UIN")
    return {
      "questions": result.questions,
      "uin": result.uin,
      "answerOrder": result.answer_order or 'random',
      "testAnswerOrder": result.test_answer_order or result.answer_order or 'random',
      "praktAnswerOrder": result.prakt_answer_order or result.answer_order or 'random',
      "temAnswerOrder": result.tem_answer_order or result.answer_order or 'random'
    }
  
class Add(Resource):
  def put(self, org, uin, category, numbers, prakt, tem):
    result = User.query.filter_by(uin=uin).first()
    if result:
      abort(409, message="UIN already exists")
    legacy_answer_order = request.args.get('answerOrder', 'random')
    test_answer_order = request.args.get('testAnswerOrder', legacy_answer_order)
    prakt_answer_order = request.args.get('praktAnswerOrder', legacy_answer_order)
    tem_answer_order = request.args.get('temAnswerOrder', legacy_answer_order)
    answer_orders = [test_answer_order, prakt_answer_order, tem_answer_order]
    if any(order not in ['random', 'points_desc'] for order in answer_orders):
      abort(400, message="Invalid answer order")

    if (org == 'fda'):
      with open(f'{category}k.json') as json_file:
        data = json.load(json_file)
      with open(f'FDA_prakt_{category}k.json') as json_file:
        dataPrakt = json.load(json_file)
        dataPrakt = dataPrakt['questions']
      with open(f'FDA_tem_{category}k.json') as json_file:
        dataTem = json.load(json_file)
        dataTem = dataTem['questions']

    elif (org == 'favt_mos'):
      with open(f'{category}mosk.json') as json_file:
        data = json.load(json_file)
      with open(f'FAVT_prakt_{category}k.json') as json_file:
        dataPrakt = json.load(json_file)
        dataPrakt = dataPrakt['tickets']
      with open(f'FAVT_tem_{category}k.json') as json_file:
        dataTem = json.load(json_file)
        dataTem = dataTem['tickets']

    elif (org == 'favt_ul'):
      with open(f'{category}ul.json') as json_file:
        data = json.load(json_file)
      with open(f'FAVT_UL_prakt_{category}k.json') as json_file:
        dataPrakt = json.load(json_file)
        dataPrakt = dataPrakt['tickets']
      with open(f'FAVT_UL_tem_{category}k.json') as json_file:
        dataTem = json.load(json_file)
        dataTem = dataTem['tickets']
    edited = {}
    editedP = []
    numbers = numbers.split(', ')
    pNumbers = prakt.split(', ')
    tNumbers = tem.split(', ')
    for i in dataPrakt:
      if (str(i['number']) in pNumbers):
        if (org == 'favt_mos' or org == 'favt_ul'):
          for question in i['questions']:
            editedP.append(question)
        if (org == 'fda'):
          editedP.append(i)
    for i in dataTem:
      if (str(i['number']) in tNumbers):
        if (org == 'favt_mos' or org == 'favt_ul'):
          for question in i['questions']:
            editedP.append(question)
        if (org == 'fda'):
          editedP.append(i)
    for i in data:
      if i in numbers:
        edited[i] = data[i]
    edited['category'] = category
    edited['org'] = org
    edited['prakt'] = editedP
    user_answer_orders = {
      'answer_order': prakt_answer_order,
      'test_answer_order': test_answer_order,
      'prakt_answer_order': prakt_answer_order,
      'tem_answer_order': tem_answer_order
    }
    if(org == 'favt_mos' or org == 'favt_ul'):
      user = User(uin=uin, questions=json.dumps(edited), ticket=int(prakt), **user_answer_orders)
    else:
      user = User(uin=uin, questions=json.dumps(edited), **user_answer_orders)
    db.session.add(user)
    db.session.commit()
    return 201

def init_database():
  db.create_all()
  columns = db.session.execute(text('PRAGMA table_info("user")')).fetchall()
  column_names = [column[1] for column in columns]
  if 'answer_order' not in column_names:
    db.session.execute(text('ALTER TABLE "user" ADD COLUMN answer_order VARCHAR(20) NOT NULL DEFAULT \'random\''))
  for column_name in ['test_answer_order', 'prakt_answer_order', 'tem_answer_order']:
    if column_name not in column_names:
      db.session.execute(text(
        f'ALTER TABLE "user" ADD COLUMN {column_name} VARCHAR(20) NOT NULL DEFAULT \'random\''
      ))
      db.session.execute(text(
        f'UPDATE "user" SET {column_name} = answer_order'
      ))
  db.session.commit()
  
class EndOfTest(Resource):
  def put(self, uin, category):
    args = video_put_args.parse_args()
    wordTemplate(uin, category, args['test'])
    return 201

class ShowAll(Resource):
  def get(self):
    a = User.query.all()
    toReturn = []
    for key in a:
      toReturn.append(key.uin)
    return({'uins': toReturn})
  
class DeleteUin(Resource):
  def delete(self, uin):
    User.query.filter_by(uin=uin).delete()
    db.session.commit()
    return 201

def wordTemplate (uin, category, args):
  args = json.loads(args)
  questions = args[str(uin)]
  countP = args['praktCount']
  countT = args['temCount']
  org = questions['org']
  if (org == 'fda'):
    doc = DocxTemplate("shablon_fda.docx")
    doc2 = DocxTemplate("shablon_fda2.docx")
  elif (org == 'favt_mos'):
    doc = DocxTemplate("shablon_favt_mos.docx")
    doc2 = DocxTemplate("shablon_favt_mos2.docx")
  elif (org == 'favt_ul'):
    doc = DocxTemplate("shablon_favt_ul.docx")
    doc2 = DocxTemplate("shablon_favt_ul2.docx")

  listOfNumbers = list(questions)[0:-3]
  context = {}
  context2 = {}
  i = 1
  count = 0
  for number in listOfNumbers:
    answers = questions[number]['answers']
    listOfAnswers = list(answers)
    context['q' + str(i)] = number
    context2['qf' + str(i)] = questions[number]['question']
    for item in listOfAnswers:
      if (answers[item].get('selected')):
        context2['af' + str(i)] = 'Неправильно ' + str(answers[item]['answer'])
    for item in listOfAnswers:
      context['a' + str(i)] = '-'
      if (answers[item]['right'] == True and 
          answers[item].get('selected')):
        context['a' + str(i)] = '+'
        context2['af' + str(i)] = 'Правильно ' + str(answers[item]['answer'])
        count += 1
        break
    i += 1

  context['uin'] = str(uin)
  context['category'] = str(category)
  context['result'] = str(count)
  context['resultP'] = str(countP)
  context['resultT'] = str(countT)
  context['timestart'] = args['testTimeStart']
  context['timeend'] = args['testTimeEnd']
  context['date'] = args['date']
  context['praktTicket'] = args['praktTicket']
  context['temTicket'] = args['temTicket']
  context2['uin'] = str(uin)
  context2['category'] = str(category)
  context2['result'] = str(count)
  context2['timestart'] = args['testTimeStart']
  context2['timeend'] = args['testTimeEnd']
  context2['date'] = args['date']
  context2['prresult'] = str(countP + countT)
  if (org == 'favt_mos' or org == 'favt_ul'):
    ticket = User.query.filter_by(uin=uin).first().ticket
    context2['praktTicket'] = ticket
    context2['temTicket'] = ticket
    context['praktTicket'] = ticket
    context['temTicket'] = ticket
    

  temCounter = 1
  prCounter = 1
  for question in questions['prakt']:
    if(question['type'] == 'tem'):
      context2['qtem' + str(temCounter)] = question['question']
      for answer in question['options']:
        if(answer.get('answered')):
          context2['atem' + str(temCounter)] = answer['answer']
      temCounter += 1
    if(question['type'] == 'prakt'):
      context2['qpr' + str(prCounter)] = question['question']
      for answer in question['options']:
        if(answer.get('answered')):
          context2['apr' + str(prCounter)] = answer['answer']
      prCounter += 1

  doc.render(context)
  doc.save(f"./passed/{org}{uin}.docx")
  doc2.render(context2)
  doc2.save(f"./passed/{org}{uin}_full.docx")



api.add_resource(Api, "/api/api/<int:uin>")
api.add_resource(Add, "/api/add/<string:org>/<int:uin>/<string:category>/<string:numbers>/<string:prakt>/<string:tem>")
api.add_resource(EndOfTest, "/api/end/<int:uin>/<string:category>")
api.add_resource(ShowAll, "/api/show")
api.add_resource(DeleteUin, "/api/del/<int:uin>")

if __name__ == "__main__":
  currentDirectory = pathlib.Path('passed/')
  for currentFile in currentDirectory.iterdir():
      print(currentFile)
  init_database()
  app.run(debug=True, host="0.0.0.0")
  
