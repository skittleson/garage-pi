import sys
import RPi.GPIO as gpio

pin = int(sys.argv[1])

gpio.setmode(gpio.BCM)
gpio.setup(pin, gpio.IN, pull_up_down=gpio.PUD_UP)

status = gpio.input(pin)
sys.stdout.write(str(status))

gpio.cleanup()