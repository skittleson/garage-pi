# docker build -t garage-pi .
# docker run -d --privileged -p 8090:8090 --name gpi garage-pi
FROM resin/raspberry-pi-node

#Updates
RUN apt-get update
RUN apt-get install python python-dev python-pip build-essential sudo -y

# Install wiringPi
RUN git clone git://git.drogon.net/wiringPi
RUN cd wiringPi && ./build

RUN sudo pip install RPi.GPIO

WORKDIR /app

COPY gpioStatus.py gpioStatus.py
COPY package.json package.json
COPY index.js index.js

RUN npm install

EXPOSE 8090

ENTRYPOINT node index.js