var input = document.getElementById('image_uploads');
var preview = document.querySelector('.preview');

input.style.opacity = 0;

input.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        for (var i = 0; i < curFiles.length; i++) {
            var para = document.createElement('p');
            if (validFileType(curFiles[i])) {
                var image = document.querySelector('img');
                image.src = window.URL.createObjectURL(curFiles[i]);


            } else {
                para.textContent = "Erreur"
            }
        }
    }
}

var fileTypes = [
    'image/jpeg',
    'image/png'
]

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}

let tabpointsSalle = [];
let imgNew = document.getElementById('newetage');
if (imgNew != null) {
    imgNew.addEventListener('click', (event) => {
        console.log(event.clientX, event.clientY);
        let point = [];
        point[0] = event.clientX;
        point[1] = event.clientY-30;
        tabpointsSalle.push(point);

        console.log(tabpointsSalle);
        if (tabpointsSalle.length == 2) {
            let otherptn1 = [];
            otherptn1.push(tabpointsSalle[1][0], tabpointsSalle[0][1]);
            let otherptn2 = [];
            otherptn2.push(tabpointsSalle[0][0], tabpointsSalle[1][1]);
            let finalzone = [];
            finalzone.push(tabpointsSalle[0], otherptn1, tabpointsSalle[1], otherptn2);
            console.log(finalzone);
            let map = document.querySelector('map');
            let area = document.createElement('area');

            area.coords = [tabpointsSalle[0][0], tabpointsSalle[0][1], tabpointsSalle[1][0], tabpointsSalle[1][1]];
            area.shape = "rect";
            area.target = "";
            area.alt = "";
            area.title = "";
            area.href = '';
            map.appendChild(area);
            tabpointsSalle = [];
            point = [];
            otherptn1 = [];
            otherptn2 = [];
            var mh = new MapHighlight(document.getElementsByTagName('img')[0], true, true, true);
mh.highlight();
        }
    });


}

