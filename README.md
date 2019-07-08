##GLOK API
    https://api.glok.co.uk/api

##HEADER

All methods require the header

    Authorization: Bearer <token>

###Login

To get the token  (valid for 24h)

##### Request


    GET /auth

   Body:
   
   { 
        "username": "user", 
        "password":"1234"
    }


### Device

To get device information 


##### Request


    GET /device
    GET /device/<device>


To get devices with the MOT ending between dates

    GET /mot/<date1>/<date2>
    
To edit device information

##### Request
    PUT /device/<device> 
    
##### Body    
    
    {
        name: name,
        mot: mot,
        notes: notes,
    }


### Log

To get the information history of a device

#### Request

    GET /log/<device>
    
Can be filtered:
 
 - by number of responses

        GET /log/<device>/<limit>
    
  - between dates 
    
        GET /log/<device>/<date1>/<date2>   
        
### Areas

To get company areas

#### Request

    GET /area
    GET /area/<id>
    
To add a new area  
    
#### Request
    POST /area
    
#### Body
        {
            name: name,
            points: [ {lat:"", lng:""} ]
        }
        
 To edit a existent area 
 
#### Request
    PUT /area/<id>
    
#### Body
        {
            name: name,
            points: [ {lat:"", lng:""} ]
        }
        
### History

To get area history log

#### Request
    POST /areaLog/areas
    
#### Body
        {
           areas: ["area_name"]
        }
 
Can be filtered:
 
 - by device

        POS /areaLog/device/<device>
    #### Body
            {
               areas: ["area_name"]
            }
    
  - by date 
    
        POST /areaLog/<date1>/<date2>  
     #### Body
             {
                areas: ["area_name"]
             }       
 - by device and date 
      
        POST /areaLog/<date1>/<date2>/<device> 
     #### Body
             {
                areas: ["area_name"]
             }
 Area history log can also be searched 
 
 - directly based on one device

#### Request
    POST /areaLog/byDevice/

#### Body
     {
        devices: ["device"]
     }

 - and device and date 

#### Request

        POST /byDeviceAndDate
#### Body
        {
            date1: "2019.07.03"
            date2: "2019.07.05"
            devices: ["device"]
        }
