# garage-pi
Garage Pi - A garage door opener and status checker built on top of a Raspberry Pi

Build docker image
`docker build -t garage-pi .`

Start container in privileged mode.
`docker run -d --privileged -p 8090:8090 --name gpi garage-pi`

Access the api `curl http://localhost:8090/api`

Check out the [blog post](https://docodethatmatters.com/yet-another-raspberry-pi-garage-door-opener/) for details.
