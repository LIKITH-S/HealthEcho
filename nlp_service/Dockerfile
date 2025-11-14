FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "api/app.py"]
