function getBinaryFrame(payload) {
    var bytes = payload.match(/.{1,2}/g);
    var binaryString = '';
    bytes.forEach(function (byte) {
      binaryString += getBinaryFromHex(byte);

    });
    if (!binaryString.match(/^([0-9]*)$/)) {
      return null;
    }
    return binaryString;
    
}
function getBinaryFromHex(byte) {
var num = Number(parseInt(byte, 16));
if (isNaN(num)) {
    return null;
}
var binary = num.toString(2);

//Fill the byte with zeros
while (binary.length < 8) {
    binary = '0' + binary;
}

return binary;
}
function getDecimalCoord(sigfoxFrame) {
var degrees = Math.floor(sigfoxFrame);
var minutes = sigfoxFrame % 1 / 60 * 100;
minutes = Math.round(minutes * 10000) / 10000;
return degrees + minutes;

}

function decodePayload(payload){
    var framePattern = /(.{1})(.{31})(.{1})(.{31})(.{2})(.{2})(.{4})(.{4})(.{4})(.{8})(.{8})/;
    var binaryFrame = getBinaryFrame(payload);
    var frame = framePattern.exec(binaryFrame);
  
    var lng = (frame[3] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[4], 2) / Math.pow(10, 6));
    var lat = (frame[1] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[2], 2) / Math.pow(10, 6));

    var temp = 


  console.log("LAT: " + lat + " || LNG: " + lng);
  }

decodePayload('032d04fc8021ac48ff560a60')