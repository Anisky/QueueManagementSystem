import RPi.GPIO as GPIO
import time
import Adafruit_DHT
from datetime import datetime
from threading import Thread
LSBFIRST = 1
MSBFIRST = 2

dataPin   = 12		#DS Pin of 74HC595(Pin14)
latchPin  = 14		#ST_CP Pin of 74HC595(Pin12)
clockPin = 16		#CH_CP Pin of 74HC595(Pin11)

#distributer pins 
indTicketPin = 22
busTicketPin = 24
spTicketPin = 26

#agent pin 
agentBtnPin = 28

# humidity and temperature sensor pin 
dhtPin      = 16

sensor = Adafruit_DHT.DHT11

global tem ,hum , deksNbr , bl
tem = 0
hum = 0
deskNum =0

bl = 0b1

# seven segment code 
num = [0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,0xff,0x6f,0x77,0x7f,0x39,0x3e,0x79,0x71]
clientCategory = [[0x77,0x73], # PA for particulars
                  [0xe3,0xf7], # BU for bussiness
                  [0x73,0xd6,]]# SP for Special needs

# setup pin configuratoin
def setup():
    GPIO.setwarnings(False)

    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(dataPin, GPIO.OUT)
    GPIO.setup(latchPin, GPIO.OUT)
    GPIO.setup(clockPin, GPIO.OUT)
    GPIO.setup(indTicketPin, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
    GPIO.setup(busTicketPin, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
    GPIO.setup(spTicketPin, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
    GPIO.setup(agentBtnPin, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

    

def shiftOut(dPin,cPin,order,val):
	for i in range(0,8):
		GPIO.output(cPin,GPIO.LOW);
		if(order == LSBFIRST):
			GPIO.output(dPin,(0x01&(val>>i)==0x01) and GPIO.HIGH or GPIO.LOW)
		elif(order == MSBFIRST):
			GPIO.output(dPin,(0x80&(val<<i)==0x80) and GPIO.HIGH or GPIO.LOW)
		GPIO.output(cPin,GPIO.HIGH);

def displayLED(s11 ,s10,s9,s8,s7,s6, s5 ,s4 ,s3,s2,s1,s0):
    GPIO.output(latchPin,GPIO.LOW)

    shiftOut(dataPin,clockPin,MSBFIRST,s11)
    shiftOut(dataPin,clockPin,MSBFIRST,s10)
    shiftOut(dataPin,clockPin,MSBFIRST,s9)
    shiftOut(dataPin,clockPin,MSBFIRST,s8)
    shiftOut(dataPin,clockPin,MSBFIRST,s7)
    shiftOut(dataPin,clockPin,MSBFIRST,s6)
    shiftOut(dataPin,clockPin,MSBFIRST,s5)
    shiftOut(dataPin,clockPin,MSBFIRST,s4)
    shiftOut(dataPin,clockPin,MSBFIRST,s3)
    shiftOut(dataPin,clockPin,MSBFIRST,s2)
    shiftOut(dataPin,clockPin,MSBFIRST,s1)
    shiftOut(dataPin,clockPin,MSBFIRST,s0)
    GPIO.output(latchPin,GPIO.HIGH)

def showTime () :
    c = datetime.now()
    displayLED(0x00,
               0x00,
               0x00,
               0x00,
               0x00,
               0x00,
               num[int(c.hour/10)],
               num[int(c.hour%10)],
               num[int(c.minute/10)] |( bl << 7),
               num[int(c.minute%10)]|( 0 << 7),
               0x00,
               0x00|( 0 << 7))
    
def showDate():
    c = datetime.now()
    displayLED(num[int((c.year%1000)/1000)],
               num[int((c.year%1000)/100)],
               num[int((c.year%100)/10)],
               num[int(c.year%10)],
               num[int(c.month/10)],
               num[int(c.month%10)],
               0x00,
               0x00,
               0x00,
               0x00,
               num[int(c.day/10)],
               num[int(c.day%10)],
               )

def showTem():
    global tem , hum
    displayLED(0x00,
               0x00,
               0x00,
               0x00,
               0x00,
               0x00,   
               num[int(tem/10)],
               num[int(tem%10)]|( 1 << 7),
               num[int(hum/10)],
               num[int(hum%10)]|( 1 << 7),
               0x00,
               0x00)

def showQueue(QueueNbr ,catNbr):
    displayLED(num[int((QueueNbr%1000)/1000)],
               num[int((QueueNbr%1000)/100)],
               num[int((QueueNbr%100)/10)],
               num[int(QueueNbr%10)],
               clientCategory[catNbr][1],
               clientCategory[catNbr][0],  
               0x00,
               0x00,
               0x00,
               0x00,
               0x00,
               0x00)  
           
    
class DhtThread:
      
    def __init__(self):
        self._running = True
          
    def terminate(self):
        self._running = False
      
    def run(self, n):
        global tem , hum
        while self._running:
            time.sleep(3)
            print('thread is running')
            humidity, temperature = Adafruit_DHT.read_retry(sensor, dhtPin)
            if humidity is not None and temperature is not None:
               tem = temperature
               hum = humidity
               print('tem : ',tem , 'hum' , hum)


# starting the Dht thread        
dhtObj = DhtThread()
t = Thread(target =dhtObj.run ,args=(10,))
t.start()

#customers class

class Customer :
    inQueue = 0
    current = 0
    count   = 0
    total = []

    def setInQueue (self , value):
        self.inQueue = value

    def setCurrent (self , value):
        self.current = value 

    def updateTotal (self, value):
        self.total.push(value)

    def setCount (self, value):
        self.count = value

    def getInQueue (self) : 
        return self.inQueue

    def getCurrent (self):
        return self.current

    def getTotal (self):
        return self.total
    def getCount (self):
        return self.count

#creating instances 
individuals  = Customer()
bussiness    = Customer()
specialNeeds = Customer()


def getIndTicket():

    individuals.setInQueue(individuals.getInQueue + 1)
    individuals.total.insert(0 , {"timestamp" : time.time(),
                                  "count"     :individuals.getCount
                                }
                            )
    

def getBusTicket():
    bussiness.setInQueue(bussiness.getInQueue + 1)
    bussiness.total.insert(0 , {"timestamp" : time.time(),
                                "count"     :bussiness.getCount
                                }
                            )
   

def getSpTicket():
    specialNeeds.setInQueue(specialNeeds.getInQueue + 1)
    specialNeeds.total.insert(0 , {"timestamp" : time.time(),
                                   "count"     :specialNeeds.getCount
                                }
                            )
def callNextCustomer():
    nextNumberCall= 0
    clientCategory= 5
    if(specialNeeds.getInQueue > 0):
        specialNeeds.setCurrent(specialNeeds.getCurrent + 1 )
        nextNumberCall = specialNeeds.getCurrent()
        clientCategory = 2
        if (specialNeeds.getInQueue > 0 ):
            specialNeeds.setInQueue(specialNeeds.getInQueue - 1 )
        
    elif (bussiness.getInQueue > 0 ):
        bussiness.setCurrent(bussiness.getCurrent + 1 )
        nextNumberCall = bussiness.getCurrent()
        clientCategory = 1
        if (bussiness.getInQueue > 0 ):
            bussiness.setInQueue(bussiness.getInQueue - 1 )
    else :
        individuals.setCurrent(individuals.getCurrent + 1 )
        nextNumberCall = individuals.getCurrent()
        clientCategory = 0
        if (individuals.getInQueue > 0 ):
            individuals.setInQueue(individuals.getInQueue - 1 )
    showQueue(nextNumberCall,clientCategory)

# program loop 
def loop():
    global bl , deskNum
    counter =1
    while True:

        if GPIO.input(indTicketPin) == GPIO.HIGH :
            getIndTicket() 
        if GPIO.input(busTicketPin) == GPIO.HIGH :
            getBusTicket() 
        if GPIO.input(spTicketPin) == GPIO.HIGH :
            getSpTicket()  
        if GPIO.input(agentBtnPin) == GPIO.HIGH :
            callNextCustomer()  

        bl = not bl
        time.sleep(0.5)
        
        if(counter % 40 < 10):
            showTem()
            showDate()
            
            
        else:
            showTime()
            showQueue()

        counter+= 1
        print('couner : {}'.format(counter))
#         displayLED(0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff)
#         
#         displayLED(0x00, 0x00,0x00, 0x00,0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00)
#         time.sleep(0.5)

def destroy():
    GPIO.cleanup()
    dhtObj.terminate()

if __name__ == '__main__': # Program starting from here 
        print ('Program is starting...' )
        setup() 
        try:
            loop()  
        except KeyboardInterrupt:  
            destroy()  