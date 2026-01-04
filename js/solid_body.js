        //Mass experiment
        let leftPanMass = 0;
        let rightPanMass = 0;
        let leftPanObject = null;
        let rightPanWeights = [];
        let experimentNumber = 1;
        let draggedElement = null;
        let oldObject = document.querySelector('#body1');
        let selectedBody = null;
        let selectedMass = null;
        let isVolume = false;
        let isMass = false;
        let substanceName1 = ["Алюміній","Залізо","Золото","Латунь","Мідь","Олово","Платина","Свинець","Скло","Срібло","Цинк","Чавун"];
        let substanceDensity1 = [2700,7800,19300,8500,8900,7300,21500,11300,2500,10500,7100,7000];
        let indexSourceBody = null;
        let volume = 0;
        let mass1 = 0;
        const container = document.querySelector(".container");
        const thread = document.querySelector("#thread");
        //const object = document.querySelector('.object');
        let experiment = null;
        let helpForBody = null
        let recordBtn = document.querySelector("#recordBtn");
        const calculationsLiquid = document.querySelector(".calculations-liquid");
        const calculationsBody = document.querySelector(".calculations-body");
        const liquid = document.querySelector("#liquid");
        const solidBody = document.querySelector("#solidBody");
        let sourceObject = null;
        const controlsVolumeSolid = document.querySelector("#controls-volume-solid");
        const controlsVolumeLiquid = document.querySelector("#controls-volume-liquid");

        // Drag and Drop functionality
        function initializeDragAndDrop() {
            const draggableItems = document.querySelectorAll('.object-item[draggable="true"]');
            const dropZones = document.querySelectorAll('.balance-pan');
            const dropZones2 = document.querySelectorAll('.object');
            const dropZones3 = document.querySelectorAll('.cylinder');

            draggableItems.forEach(item => {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragend', handleDragEnd);
            });

            dropZones.forEach(zone => {
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('drop', handleDrop);
                zone.addEventListener('dragenter', handleDragEnter);
                zone.addEventListener('dragleave', handleDragLeave);
            });

            dropZones2.forEach(zone => {
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('drop', handleDrop);
                zone.addEventListener('dragenter', handleDragEnter);
                zone.addEventListener('dragleave', handleDragLeave);
            });

            dropZones3.forEach(zone => {
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('drop', handleDrop);
                zone.addEventListener('dragenter', handleDragEnter);
                zone.addEventListener('dragleave', handleDragLeave);
            });
        }

        function handleDragStart(e) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
            draggedElement = null;
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }

        function handleDragEnter(e) {
            e.preventDefault();
            e.target.classList.add('drag-over');
        }

        function handleDragLeave(e) {
            e.target.classList.remove('drag-over');
        }

        function handleDrop(e) {
            e.preventDefault();
            e.target.classList.remove('drag-over');
            
            if (!draggedElement) return;
 

            const isLeftPan = e.target.id === 'leftPan' || e.target.closest('#leftPan');
            const isRightPan = e.target.id === 'rightPan' || e.target.closest('#rightPan');
            const isObject = e.target.id === 'object' || e.target.closest('#object');
            const isCylinder = e.target.id === 'cylinder' || e.target.closest('#cylinder');
            
            if (!isLeftPan && !isRightPan && !isObject && !isCylinder) return;
            const itemType = draggedElement.dataset.type;
            const mass = parseInt(draggedElement.dataset.mass);
            
            if (isObject && itemType === 'body') {
                placeBodyOnObject(draggedElement, mass);
            }

            if (isCylinder && itemType === 'body') {   
                if (isMass) {         
                    placeBodyOnCylinder(draggedElement, mass);
                    isMass = false;
                }
                else{
                    if (draggedElement.id == "fullGlass") {
                        alert("Спочатку виміряйте масу склянки з рідиною");      
                    }  
                    if (draggedElement.id == "emptyGlass") {
                        alert("Спочатку виміряйте масу порожньої склянки");      
                    }             
                }
            }

            if (isLeftPan && itemType === 'body') {
                if (leftPanObject) {
                    alert('На лівій шальці вже є тіло! Спочатку очистіть терези.');
                    return;
                }
                placeBodyOnLeft(draggedElement, mass);
            } 
            else {
                if (isMass) {
                    return;
                } 
                if (isRightPan && itemType === 'weight') {
                    addWeightToRight(draggedElement, mass);
                } 
                else {
                    if (itemType === 'body' && isRightPan) {
                        alert('Тіла слід класти на ліву шальку!');
                    } 
                    else {
                        if (itemType === 'weight' && isLeftPan) {
                            alert('Важки слід класти на праву шальку!');
                        }
                    } 
                }
            }
                 
        }

        function placeBodyOnObject(element, mass) {
            if(isMass) {
                const name = element.dataset.name;

                oldObject.style.opacity = '1';
                oldObject.draggable = true;
                oldObject = element;

                //objectMass = mass;
                volumObject = {
                    name: name,
                    mass: mass,
                    element: element
                };

                // Add visual representation to volume object
                    
                if(element.id == "body1"){
                    object.style.background = "#FF6B6B";
                    object.style.border = "none";
                    selectedBody = name;
                    selectedMass = mass; 
                    document.querySelector("#body2").style.display = "none";               
                }
                else {
                    if (element.id == "body2") {
                        object.style.background = "#4ECDC4";
                        object.style.border = "none";
                        selectedBody = name;
                        selectedMass = mass;
                        document.querySelector("#body1").style.display = "none";
                    }
                    else{
                        alert('Оберіть "Тіло №1" або "Тіло №2".');
                    }
                }    
                document.querySelectorAll('.object-item').forEach(element => {
                    element.style.opacity = '0.3';
                    element.draggable = false;
                }); 
                volumeExperiment.activateButton('fill-water');   

                if(isVolume){
                    alert("Потрібно виміряти масу. Перетягніть тіло до лівої шальки.");
                    volumeExperiment.reset();
                }  
            }
            else {
                alert("Спочатку виміряйте масу тіла");
            }                 
        }

        function placeBodyOnLeft(element, mass) {
            const name = element.dataset.name;
            
            leftPanMass = mass;
            leftPanObject = {
                name: name,
                mass: mass,
                element: element
            };
            
            // Add visual representation to left pan
            const leftContents = document.getElementById('leftContents');
            const objectVisual = element.querySelector('.object-visual').cloneNode(true);
            objectVisual.style.width = '35px';
            objectVisual.style.height = '35px';
            objectVisual.classList.add('on-pan-item');
            leftContents.appendChild(objectVisual);
            
            // Hide original element
            element.style.opacity = '0.3';
            element.draggable = false;
            
            updateBalance();
            updateBalanceStatus();

            if(element.id == "body1"){
                document.querySelector("#body2").style.display = "none";               
            }
            else {
                if(element.id == "body2"){
                    document.querySelector("#body1").style.display = "none";               
                }
            }

            if(isMass){
                alert(helpForBody);
                clearBalance();
            }
        }

        function placeBodyOnCylinder(element, mass) {
            const name = element.dataset.name; 
            let density = 1;
            massId = "massBody" + experimentNumber;
            let massMeasured = document.querySelector("#" + massId).textContent;
            let liquidMass = massMeasured - emptyGlass.dataset.mass;
            finalWaterLevel = Math.round((liquidMass/density / 280) * 200);
            
            // Add visual representation to cylinder
            water.style.height = (finalWaterLevel) + "px";  
            fullGlass.style.display = "none"; 
            emptyGlass.style.display = "block";   
            
            volumeExperiment.activateButton("calculate-volume2");
        }

        function addWeightToRight(element, mass) {
            rightPanMass += mass;
            rightPanWeights.push(mass);
            
            // Add visual representation to right pan
            const rightContents = document.getElementById('rightContents');
            const weightVisual = element.querySelector('.weight-visual').cloneNode(true);
            weightVisual.style.margin = '2px';
            weightVisual.classList.add('on-pan-item');
            weightVisual.dataset.mass = mass;
            
            // Add click handler to remove weight
            weightVisual.addEventListener('click', function() {
                removeWeight(this, mass);
            });
            
            rightContents.appendChild(weightVisual);
            
            updateBalance();
            updateBalanceStatus();
        }

        function removeWeight(weightElement, mass) {
            rightPanMass -= mass;
            const index = rightPanWeights.indexOf(mass);
            if (index > -1) {
                rightPanWeights.splice(index, 1);
            }
            
            weightElement.remove();
            
            updateBalance();
            updateBalanceStatus();
        }

        function updateBalance() {
            const beam = document.getElementById('balanceBeam');
            const arrow = document.getElementById('balanceArrow');
            const difference = leftPanMass - rightPanMass;
            
            // Calculate rotation angle (max 20 degrees)
            // Важче тіло опускається - позитивна різниця означає поворот проти годинникової стрілкі
            const maxAngle = 20;
            const angle = Math.max(-maxAngle, Math.min(maxAngle, difference * 0.08));
            
            beam.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
            arrow.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
            // Enable record button if balanced (within 1 gram tolerance)
            const isBalanced = Math.abs(difference) <= 1 && leftPanObject;
            document.getElementById('recordBtn').disabled = !isBalanced;
        }

        function updateBalanceStatus() {
            const status = document.getElementById('balanceStatus');
            
            if (!leftPanObject) {
                status.textContent = 'Перетягніть тіло на ліву шальку для початку зважування';
                if (isMass) {
                    status.className = 'balance-status disabled';
                }
                else {
                    status.className = 'balance-status neutral';
                }                
                return;
            }
            
            const difference = Math.abs(leftPanMass - rightPanMass);
            
            if (difference <= 1) {
                status.textContent = `✓ Терези збалансовані! Маса: ${rightPanMass} г`;
                status.className = 'balance-status balanced';
            } else {
                const heavier = leftPanMass > rightPanMass ? 'ліва' : 'права';
                //status.textContent = `Терези не збалансовані (${heavier} шалька важча на ${difference} г)`;
                status.textContent = `Виміряйте масу тіла`;
                status.className = 'balance-status unbalanced';
            }
        }

        function recordResultMass() {
            if (!leftPanObject || Math.abs(leftPanMass - rightPanMass) > 1) return;
            
            /*let tbody = document.getElementById('resultsBody');
            let row = tbody.insertRow();
            
            // Format weights list
            const weightsCount = {};
            rightPanWeights.forEach(weight => {
                weightsCount[weight] = (weightsCount[weight] || 0) + 1;
            });
            
            const weightsList = Object.entries(weightsCount)
                .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                .map(([weight, count]) => count > 1 ? `${count}×${weight}г` : `${weight}г`)
                .join(', ');
            
            row.innerHTML = `
                <td>${experimentNumber}</td>
                <td>${leftPanObject.name}</td>
                <td>${weightsList}</td>
                <td>${rightPanMass}</td>
            `;*/
            
            if (experiment == 2) {
                volumeExperiment.activateButton('change-body2');
            }
            if(experiment == 1) {
                volumeExperiment.activateButton('change-body');
                let tbody = document.getElementById('resultsBodyDensity');
            
                if(!isVolume) {
                
                    const row = tbody.insertRow();    
                    row.id = 'row' + experimentNumber; 
                    row.innerHTML = `
                        <td id='nameBody${experimentNumber}'>${leftPanObject.name}</td>
                        <td id='massBody${experimentNumber}'>${rightPanMass}</td>
                        <td id='volumeBody${experimentNumber}'>&nbsp;</td>
                        <td id='densityBody1${experimentNumber}'>&nbsp;</td>
                        <td id='densityBody2${experimentNumber}'>&nbsp;</td>
                        <td id='substanceBody${experimentNumber}'>&nbsp;</td>
                    `;
                    mass1 = rightPanMass;
                    isMass = true;
                }
                else {
                    let massBody = 'massBody' + experimentNumber;
                    document.querySelector('#' + massBody).textContent = rightPanMass;
                    let densityBody1 = 'densityBody1' + experimentNumber;
                    document.querySelector('#' + densityBody1).textContent = (rightPanMass / volume).toFixed(3);
                    let densityBody2 = 'densityBody2' + experimentNumber;
                    document.querySelector('#' + densityBody2).textContent = Math.round(1000 * rightPanMass / volume);
                    let substanceBody = 'substanceBody' + experimentNumber;
                    document.querySelector('#' + substanceBody).textContent = substanceName1[indexSourceBody] + "(" + substanceDensity1[indexSourceBody] + ")";
                    isMass = false;
                    isVolume = false;
                    experimentNumber++;
                    document.querySelector('#body1').style.display = "block";
                    document.querySelector('#body2').style.display = "block";
                    liquid.disabled = false;
                    solidBody.disabled = false;
                }  
            } 
            
            if(experiment == 2) {
                let tbody = document.getElementById('resultCalculationLiquid');
                const row = tbody.insertRow();
                row.id = 'row' + experimentNumber;
                row.innerHTML = `
                        <td id='nameBody${experimentNumber}'>${leftPanObject.name}</td>
                        <td id='massBody${experimentNumber}'>${rightPanMass}</td>
                    `;
                mass1 = rightPanMass;
                isMass = true;
            }                
                
            clearBalance();
            
        }

        // Initialize drag and drop when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeDragAndDrop();
            updateBalanceStatus();
        });

        function clearBalance() {
            // Clear pans
            document.getElementById('leftContents').innerHTML = '';
            document.getElementById('rightContents').innerHTML = '';
            
            // Restore original objects
            if (leftPanObject && leftPanObject.element) {
                leftPanObject.element.style.opacity = '1';
                leftPanObject.element.draggable = true;
            }
            
            // Reset masses and objects
            leftPanMass = 0;
            rightPanMass = 0;
            sourceObject = leftPanObject;
            leftPanObject = null;
            rightPanWeights = [];
            
            // Reset buttons
            document.getElementById('recordBtn').disabled = true;
            
            // Reset balance beam
            document.getElementById('balanceBeam').style.transform = 'translateX(-50%) rotate(0deg)';
            
            updateBalance();
            updateBalanceStatus();
        }

        function initDataMass() {
            const body1 = document.querySelector("#body1");
            const body2 = document.querySelector("#body2");
            const emptyGlass = document.querySelector("#emptyGlass");
            const fullGlass = document.querySelector("#fullGlass");
            let massBody1 = Math.floor(Math.random() * (200 - 100) + 100);
            body1.setAttribute('data-mass', massBody1);
            let massBody2 = Math.floor(Math.random() * (200 - 100) + 100);
            body2.setAttribute('data-mass', massBody2);
            let massGlass = [10, 20, 30, 40, 50];
            let typeGlass = Math.floor(Math.random() * 5);
            emptyGlass.setAttribute('data-mass', massGlass[typeGlass]);
            let massWater = Math.floor(Math.random() * (4 * massGlass[typeGlass] - massGlass[typeGlass]) + massGlass[typeGlass]);
            fullGlass.setAttribute('data-mass', (massGlass[typeGlass] + massWater));
        }

        function execSolidBody() {
            experiment = 1;
            //liquid.disabled = true;
            solidBody.disabled = true;
            helpForBody = "Потрібно виміряти об'єм тіла. Перетягніть тіло до нитки."
            emptyGlass.style.display = "none";
            fullGlass.style.display = "none";
            calculationsLiquid.style.display = "none";
            controlsVolumeLiquid.style.display = "none";
            controlsVolumeSolid.style.display = "flex";
            calculationsBody.style.display = "block";
            body1.style.display = "block";
            body2.style.display = "block";
            object.style.display = "block";
            thread.style.display = "block";
            container.style.display = "block";
        }

        function execLiquid() {  
            experiment  = 2;  
            liquid.disabled = true;
            solidBody.disabled = true;
            helpForBody = "Потрібно виміряти об'єм рідини. Перетягніть склянку з рідиною до вимірювального циліндра."      
            thread.style.display = "none";
            object.style.display = "none";
            body1.style.display = "none";
            body2.style.display = "none";
            emptyGlass.style.display = "none";
            calculationsBody.style.display = "none";
            controlsVolumeSolid.style.display = "none";
            controlsVolumeLiquid.style.display = "flex";
            calculationsLiquid.style.display = "block";
            fullGlass.style.display = "block";
            container.style.display = "block";
            recordBtn.textContent = "Виміряти масу";
        }

        // Initialize drag and drop when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeDragAndDrop();
            updateBalanceStatus();
            initDataMass();
        });