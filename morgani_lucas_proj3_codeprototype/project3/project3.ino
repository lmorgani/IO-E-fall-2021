/*This is an exercise in using sensor data to output tone 
 write a conditional statement that will output 3 different tones 
 based on min mid and max light sensor numbers
 
*/
/* Sweep
 by BARRAGAN <http://barraganstudio.com>
 This example code is in the public domain.

 modified 8 Nov 2013
 by Scott Fitzgerald
 http://www.arduino.cc/en/Tutorial/Sweep
*/


#define LED 6
int light_sensor = A3;
 
void setup() {
Serial.begin(9600); //begin Serial Communication
pinMode(LED,OUTPUT);//Sets the pinMode to Output 
}
 
void loop() {
  int raw_light = analogRead(light_sensor); // read the raw value from light_sensor pin (A3)
  int light = map(raw_light, 0, 1023, 0, 100); // map the value from min, max to 0, 100
 
//  Serial.print(""); 
  Serial.println(light); // print the light value in Serial Monitor


 
  delay(750); // add a delay to only read and print every 1 second

}
