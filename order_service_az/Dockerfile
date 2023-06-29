# FROM python:3.6-slim-buster

FROM python:alpine

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .



# CMD [ "flask", "run", "--host=0.0.0.0", "--port=4000" ]
CMD ["python", "app.py"]
# CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]