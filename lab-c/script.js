function getLocation() {
    
    let map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)
    let marker = L.marker([51.505, -0.09], 13).addTo(map);
    
    document.getElementById("pobieranie").addEventListener("click", function () {
        leafletImage(map, function (err, canvas) {
            if (err) {
                console.error(err);
                return;
            }
    
            const rasterMap = document.getElementById("mapa_rastrowa");
            const context = rasterMap.getContext("2d");
    
            rasterMap.width = canvas.width;
            rasterMap.height = canvas.height;
            context.clearRect(0, 0, rasterMap.width, rasterMap.height);
            context.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);
    
            splitRasterMapIntoPuzzles(rasterMap, 4, 4);
        });
    });

    document.getElementById("getLocation").addEventListener("click", function(event) {
        if (!navigator.geolocation) {
            alert("Sorry, no geolocation available for you!");
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
    
            map.setView([lat, lon], 13);
    
            L.marker([lat, lon]).addTo(map)
                .bindPopup("Twoja lokalizacja")
                .openPopup();
    
            document.getElementById("latitude").innerText = lat;
            document.getElementById("longitude").innerText = lon;
        }, (positionError) => {
            console.error(positionError);
        }, {
            enableHighAccuracy: false
        });
    
    });

}

let correctPuzzleOrder = [];

function splitRasterMapIntoPuzzles(canvas, rows, cols) {
    const puzzleContainer = document.getElementById("puzzleContainer");
    const context = canvas.getContext("2d");
    const puzzleWidth = canvas.width / cols;
    const puzzleHeight = canvas.height / rows;

    puzzleContainer.innerHTML = "";
    const puzzlePieces = [];
    correctPuzzleOrder = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const id = `${row}-${col}`;
            correctPuzzleOrder.push(id);

            const puzzlePiece = document.createElement("canvas");
            puzzlePiece.width = puzzleWidth;
            puzzlePiece.height = puzzleHeight;
            puzzlePiece.classList.add("puzzle-piece");
            puzzlePiece.draggable = true;
            puzzlePiece.id = `piece-${id}`;

            const puzzleContext = puzzlePiece.getContext("2d");
            puzzleContext.drawImage(
                canvas,
                col * puzzleWidth,
                row * puzzleHeight,
                puzzleWidth,
                puzzleHeight,
                0,
                0,
                puzzleWidth,
                puzzleHeight
            );

            puzzlePiece.addEventListener("dragstart", function (event) {
                event.dataTransfer.setData("text", puzzlePiece.id);
            });

            puzzlePieces.push(puzzlePiece);
        }
    }

    shuffleArray(puzzlePieces);

    puzzlePieces.forEach(piece => puzzleContainer.appendChild(piece));
}

function createPuzzleBoard(rows, cols) {
    const puzzleBoard = document.getElementById("puzzleBoard");
    puzzleBoard.innerHTML = '';

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement("div");
        cell.classList.add("drag-target");

        cell.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        cell.addEventListener("drop", function (event) {
            event.preventDefault();
            const puzzleId = event.dataTransfer.getData("text");
            const puzzlePiece = document.getElementById(puzzleId);

            if (!this.hasChildNodes()) {
                this.appendChild(puzzlePiece);
            }

            
            setTimeout(() => checkPuzzleCompletion(), 0);
        });

        puzzleBoard.appendChild(cell);
    }
}




function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkPuzzleCompletion() {
    const puzzleBoard = document.getElementById("puzzleBoard");
    const cells = puzzleBoard.getElementsByClassName("drag-target");

    let isCorrect = true;

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const expectedId = `piece-${correctPuzzleOrder[i]}`;

        if (cell.hasChildNodes()) {
            const child = cell.firstChild;

            if (child.id !== expectedId) {
                isCorrect = false;
                break;
            }
        } else {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        console.log("Gratulacje! Układanka została poprawnie ułożona!")
        alert("Gratulacje! Układanka została poprawnie ułożona!");
    }
}


createPuzzleBoard(4, 4);
getLocation();