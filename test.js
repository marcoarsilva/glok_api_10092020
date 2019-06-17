


function batterypayload(payload) {
    var binary = parseInt(payload, 16);
    return (binary*15)/1000;
}


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

function batteryToPercent(battery, voltage) {
    if (battery.length <= 3){
      
      var h = parseInt(battery) + parseInt(voltage);
      var p = parseFloat((h*15)/1000); 
      
      if(p > 2.54) {
        let bat =(((p - 2.54) * 100) / 1.66).toFixed(0);
        bat > 100 ? p = 100 : p = bat;
      } else {
          p = 0;
      }
    
      return p
    } 
    return "ERR"
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

  var framePattern = /(.{1})(.{31})(.{1})(.{31})(.{8})(.{8})(.{8})(.{4})(.{4})/;
  var binaryFrame = getBinaryFrame("032a8245802311c7ff7119c0");
  var frame = framePattern.exec(binaryFrame);

  

  var bat = frame[5] + frame[7];  



 