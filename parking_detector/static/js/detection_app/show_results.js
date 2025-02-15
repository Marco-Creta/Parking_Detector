url_detection = "http://127.0.0.1:8000/detection/use_service/"
url_acquisition = "http://127.0.0.1:8000/acquisition/"
const standard_btn_color = "#33ccff"
const clicked_btn_color = "#1791b9"
let prev_clicked = null
const image_tag = document.getElementById("ItemPreview")
const free_slots = document.getElementById("freeSlots")

//When the user clicks on a camera this function will be triggered

function serviceRequest(id){
    //Change button color if clicked and restore the previous button clicked color
    if(prev_clicked != null && prev_clicked != id){
        document.getElementById(prev_clicked).style.background = standard_btn_color
    }
    prev_clicked = id
    document.getElementById(prev_clicked).style.background = clicked_btn_color

    getImage(url_detection, url_acquisition, id)
}

//Get the cookie for django
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//Send the requesto to the acquisition module
function getImage(url_detection, url_acquisition, id)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //Once the frame is received it is sent to the service
            res = JSON.parse(xmlHttp.response);
            if(res["image"] == null || res["mapping"] == null){
                alert("Error! The camera was not found..")
                image_tag.src = ""
            }else{
                sendImage(url_detection, xmlHttp.response);
            }
        }
    }
    xmlHttp.open("POST", url_acquisition, true); // true for asynchronous 
    //xmlHttp.responseType = 'arraybuffer';
    csrftoken = getCookie('csrftoken'); 
    xmlHttp.setRequestHeader("X-CSRFToken", csrftoken); 
    xmlHttp.send(id);
}

//Send the image received from the acquisition to the service
function sendImage(url_detection, encoded_image)
{
    csrftoken = getCookie('csrftoken'); 
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //Once the frame is received it is sent to the service
            res = JSON.parse(xmlHttp.response);

            image_tag.src = "data:image/jpeg;base64," + res["image"];
            console.log();
            free_slots.textContent = "Number of free slots: " + res["free_slots"];

        }
    }
    xmlHttp.open("POST", url_detection, true); // true for asynchronous 
    xmlHttp.setRequestHeader("X-CSRFToken", csrftoken); 
    xmlHttp.send(encoded_image);
}

