FROM python:3.6 

ENV PYTHONUNBUFFERED 1

# Set the working directory to /app
WORKDIR /app

ADD . /app

COPY ./requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

COPY . /app






