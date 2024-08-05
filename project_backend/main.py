from flask import Flask
from flask_restful import Api, Resource, abort, reqparse
from flask_sqlalchemy import SQLAlchemy
import json
from flask_cors import CORS
from docxtpl import DocxTemplate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
api = Api(app)
CORS(app)

db = SQLAlchemy(app)
app.app_context().push()

video_put_args = reqparse.RequestParser()
video_put_args.add_argument("test", type=str)

# with open(f'1prakt.json') as json_file:
#   data = json.load(json_file)
# print(data['questions'][1])

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  uin = db.Column(db.Integer)
  questions = db.Column(db.Text)
  passed = db.Column(db.Integer)

  def __repr__(self):
    return f'id:{self.id}, uin:{self.uin}, questions:{self.questions}'

class Api(Resource):
  def get(self, uin):
    result = User.query.filter_by(uin=uin).first()
    if not result:
      abort(404, message="Could not find this UIN")
    return {"questions": result.questions, "uin": result.uin}
  
class Add(Resource):
  def put(self, org, uin, category, numbers, prakt, tem):
    result = User.query.filter_by(uin=uin).first()
    if result:
      abort(409, message="UIN already exists")
    if (org == 'fda'):
      with open(f'{category}k.json') as json_file:
        data = json.load(json_file)
    elif (org == 'favt_mos'):
      with open(f'{category}mosk.json') as json_file:
        data = json.load(json_file)
    with open('1prakt.json') as json_file:
      dataPrakt = json.load(json_file)
      dataPrakt = dataPrakt['questions']
    with open('1tem.json') as json_file:
      dataTem = json.load(json_file)
      dataTem = dataTem['questions']
    edited = {}
    editedP = []
    numbers = numbers.split(', ')
    pNumbers = prakt.split(', ')
    tNumbers = tem.split(', ')
    for i in dataPrakt:
      if (str(i['number']) in pNumbers):
        editedP.append(i)
    for i in dataTem:
      if (str(i['number']) in tNumbers):
        editedP.append(i)
    for i in data:
      if i in numbers:
        edited[i] = data[i]
    edited['category'] = category
    edited['org'] = org
    edited['prakt'] = editedP
    user = User(uin=uin, questions=json.dumps(edited))
    db.session.add(user)
    db.session.commit()
    return 201
  
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
  # countP = args['praktCount']
  # countT = args['temCount']
  org = questions['org']
  if (org == 'fda'):
    doc = DocxTemplate("shablon_fda.docx")
    doc2 = DocxTemplate("shablon_fda2.docx")
  elif (org == 'favt_mos'):
    doc = DocxTemplate("shablon_favt_mos.docx")
    doc2 = DocxTemplate("shablon_favt_mos2.docx")
  listOfNumbers = list(questions)[0:-2]
  print('------------------', listOfNumbers)
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
        context2['af' + str(i)] = 'Правильно ' + answers[item]['answer']
        count += 1
        break
    i += 1
  context['uin'] = str(uin)
  context['category'] = str(category)
  context['result'] = str(count)
  # context['resultP'] = str(countP)
  # context['resultT'] = str(countT)
  context['timestart'] = args['testTimeStart']
  context['timeend'] = args['testTimeEnd']
  context['date'] = args['date']
  context2['uin'] = str(uin)
  context2['category'] = str(category)
  context2['result'] = str(count)
  context2['timestart'] = args['testTimeStart']
  context2['timeend'] = args['testTimeEnd']
  context2['date'] = args['date']
  doc.render(context)
  doc.save(f"./passed/{org}{uin}.docx")
  doc2.render(context2)
  doc2.save(f"./passed/{org}{uin}_full.docx")



api.add_resource(Api, "/api/<int:uin>")
api.add_resource(Add, "/add/<string:org>/<int:uin>/<string:category>/<string:numbers>/<string:prakt>/<string:tem>")
api.add_resource(EndOfTest, "/end/<int:uin>/<string:category>")
api.add_resource(ShowAll, "/show")
api.add_resource(DeleteUin, "/del/<int:uin>")

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0")
  db.create_all()