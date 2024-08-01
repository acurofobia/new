FROM python:3.12.4-slim

COPY requirements.txt requirements.txt
RUN pip install requirements.txt

COPY . .

CMD ["python", main.py]