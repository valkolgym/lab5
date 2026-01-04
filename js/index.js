 //Volume experiment
        class VolumeExperiment {
                constructor() {
                    this.currentStep = 1;
                    this.initialWaterLevel = 0;
                    this.finalWaterLevel = 0;
                    this.scalePrice = 5; // мл
                    this.waterHeight = 120; // початкова висота води в пікселях
                    this.objectVolume = 0; // об'єм об'єкта в мл

                    this.initializeScale();
                    this.bindEvents();
                    this.updateStep();
                }

                initializeScale() {
                    const scale = document.getElementById('scale');
                    scale.innerHTML = '';

                    // Створюємо шкалу від 0 до 200 мл з кроком 10 мл
                    for (let i = 0; i < 200; i += 10) {
                        const mark = document.createElement('div');
                        mark.className = 'scale-mark';
                        mark.style.bottom = `${(i / 200) * 280}px`;                
                        if (i % 20 === 0) {
                            mark.style.width = '20px';
                            mark.style.background = '#000';
                            const number = document.createElement('div');
                            number.className = 'scale-number';
                            number.textContent = i;
                            number.style.bottom = `${(i / 200) * 280}px`;
                            scale.appendChild(number);
                        }
                        scale.appendChild(mark);
                    }
                    const volumeUnits = document.createElement('div');
                    volumeUnits.className = 'volume-units';
                    volumeUnits.textContent = 'мл';
                    scale.appendChild(volumeUnits);
                }

                bindEvents() {
                    document.getElementById('fill-water').addEventListener('click', () => this.fillWater());
                    document.getElementById('measure-initial').addEventListener('click', () => this.measureInitial());
                    document.getElementById('submerge-object').addEventListener('click', () => this.submergeObject());
                    document.getElementById('measure-final').addEventListener('click', () => this.measureFinal());
                    document.getElementById('calculate-volume').addEventListener('click', () => this.calculateVolume());
                    document.getElementById('calculate-volume2').addEventListener('click', () => this.calculateVolume2());
                    //document.getElementById('reset').addEventListener('click', () => this.reset());
                }

                fillWater() {
                    const water = document.getElementById('water');
                    water.style.height = `${this.waterHeight}px`;

                    this.activateButton('measure-initial');
                    this.updateStep(2);

                    setTimeout(() => {
                        this.updateStep(3);
                    }, 1000);
                }

                measureInitial() {
                    this.initialWaterLevel = Math.round((this.waterHeight / 280) * 200);
                    //document.getElementById('initial-level').textContent = `${this.initialWaterLevel} мл`;

                    let tbody = document.getElementById('resultCalculationBody');
                    const row = tbody.insertRow();
                    row.id = 'row' + experimentNumber;
                    row.innerHTML = `
                        <td id='nameBody${experimentNumber}'>${sourceObject.name}</td>
                        <td id='initialLevel${experimentNumber}'>${this.initialWaterLevel}</td>
                        <td id='finalLevel${experimentNumber}'>&nbsp;</td>
                        <td id='volumeBody1${experimentNumber}'>&nbsp;</td>
                    `;


                    this.activateButton('submerge-object');
                    this.updateStep(4);
                }

                submergeObject() {
                    //const object = document.querySelector('.object');
                    const water = document.getElementById('water');
                    if(indexSourceBody == null) {
                        indexSourceBody = Math.floor(Math.random() * 12);
                    }
                    
                    this.objectVolume = selectedMass / (substanceDensity1[indexSourceBody] / 1000);

                    // Анімація нитки та об'єкта
                    thread.classList.add('extended');
                    object.classList.add('submerged');

                    // Підняття рівня води
                    setTimeout(() => {
                        const newHeight = this.waterHeight + (this.objectVolume / 200) * 280;
                        water.style.height = `${newHeight}px`;
                        this.waterHeight = newHeight;

                        this.activateButton('measure-final');
                        this.updateStep(5);
                    }, 1000);
                }

                measureFinal() {
                    this.finalWaterLevel = Math.round((this.waterHeight / 280) * 200);
                    //document.getElementById('final-level').textContent = `${this.finalWaterLevel} мл`;

                    let finalLevel = 'finalLevel' + experimentNumber;
                    document.querySelector('#' + finalLevel).textContent = this.finalWaterLevel;
                    let volumeBody= 'finalLevel' + experimentNumber;
                    document.querySelector('#' + volumeBody).textContent = this.finalWaterLevel;

                    this.activateButton('calculate-volume');
                    this.updateStep(6);
                }

                calculateVolume() {
                    volume = this.finalWaterLevel - this.initialWaterLevel;
                    volumeExperiment.activateButton('fill-water');
                    let tbody = document.getElementById('resultsBodyDensity');
                                   
                        if(!isMass) {
                            const row = tbody.insertRow();
                            row.id = 'row' + experimentNumber;
                            row.innerHTML = `
                                <td id='nameBody${experimentNumber}'>${selectedBody}</td>
                                <td id='massBody${experimentNumber}'>&nbsp;</td>
                                <td id='volumeBody${experimentNumber}'>${volume}</td>
                                <td id='densityBody1${experimentNumber}'>&nbsp;</td>
                                <td id='densityBody2${experimentNumber}'>&nbsp;</td>
                                <td id='substanceBody${experimentNumber}'>&nbsp;</td>
                            `;
                            isVolume = true;
                        }
                        else {
                            let volumeBody = 'volumeBody' + experimentNumber;
                            document.querySelector('#' + volumeBody).textContent = volume;
                            let volumeBody1 = 'volumeBody1' + experimentNumber;
                            document.querySelector('#' + volumeBody1).textContent = volume;
                            let densityBody1 = 'densityBody1' + experimentNumber;
                            document.querySelector('#' + densityBody1).textContent = (mass1 / volume).toFixed(3);
                            let densityBody2 = 'densityBody2' + experimentNumber;
                            document.querySelector('#' + densityBody2).textContent = Math.round(1000 * mass1 / volume);
                            let substanceBody = 'substanceBody' + experimentNumber;
                            document.querySelector('#' + substanceBody).textContent = substanceName1[indexSourceBody] + "(" + substanceDensity1[indexSourceBody] + ")";
                            isMass = false;
                            isVolume = false;
                            experimentNumber++;
                            //document.querySelector('#body1').style.display = "block";
                            //document.querySelector('#body2').style.display = "block";
                            liquid.disabled = false;
                            //solidBody.disabled = false;
                            sourceElement.style.display = "none";
                        }
                        
                        this.reset();
                        this.updateStep(6);
                        updateBalanceStatus();           
                }

                calculateVolume2() { 
                    //this.finalWaterLevel = Math.round((this.waterHeight / 280) * 200);
                    emptyGlass.style.display = "block";
                    volume = Math.round((finalWaterLevel / 280) * 200);
                    volumeExperiment.activateButton('fill-water');
                    let tbody = document.getElementById('resultsBodyDensity');
                    document.getElementById("volumeLiquid" + experimentNumber).innerHTML = volume;
                                   
                        if(!isMass) {
                            const row = tbody.insertRow();
                            row.id = 'row' + experimentNumber;
                            row.innerHTML = `
                                <td id='nameBody${experimentNumber}'>Рідина</td>
                                <td id='massBody1${experimentNumber}'>&nbsp;</td>
                                <td id='volumeBody${experimentNumber}'>${volume}</td>
                                <td id='densityBody1${experimentNumber}'>&nbsp;</td>
                                <td id='densityBody2${experimentNumber}'>&nbsp;</td>
                                <td id='substanceBody${experimentNumber}'>&nbsp;</td>
                            `;
                            isVolume = true;
                        }
                        else {
                            let volumeBody = 'volumeBody' + experimentNumber;
                            document.querySelector('#' + volumeBody).textContent = volume;
                            let volumeBody1 = 'volumeBody1' + experimentNumber;
                            document.querySelector('#' + volumeBody1).textContent = volume;
                            let densityBody1 = 'densityBody1' + experimentNumber;
                            document.querySelector('#' + densityBody1).textContent = (mass1 / volume).toFixed(3);
                            let densityBody2 = 'densityBody2' + experimentNumber;
                            document.querySelector('#' + densityBody2).textContent = Math.round(1000 * mass1 / volume);
                            isMass = false;
                            isVolume = false;
                            experimentNumber++;
                            liquid.disabled = false;
                            //solidBody.disabled = false;
                        }
                        
                        this.reset();
                        this.updateStep(6);
                        updateBalanceStatus();
                }

                reset() {
                    // Скидання всіх значень
                    this.currentStep = 1;
                    this.initialWaterLevel = 0;
                    this.finalWaterLevel = 0;
                    this.waterHeight = 120;

                    // Скидання UI
                    const water = document.getElementById('water');
                    water.style.height = '0px';

                    //const object = document.querySelector('.object');
                    object.classList.remove('submerged');
                    thread.classList.remove('extended');

                    const result = document.getElementById('result');
                    result.classList.remove('show');

                    //object.style.background = "#fff";
                    object.style.border = "dashed";
                    object.style.borderWidth = "1px";

                    // Скидання кнопок
                    this.resetButtons();
                    //this.activateButton('change-body');
                    this.updateStep(1);

                    //Restore object draggable
                    oldObject.style.opacity = '1';
                    oldObject.draggable = true;
                    document.querySelectorAll('.object-item').forEach(element => {
                        element.style.opacity = '1';
                        element.draggable = true;
                    }); 
                    object.style.background = "#fff";
                }

                updateStep(step) {
                    if (step) this.currentStep = step;

                    document.querySelectorAll('.step').forEach((el, index) => {
                        el.classList.remove('active', 'completed');
                        if (index + 1 === this.currentStep) {
                            el.classList.add('active');
                        } else if (index + 1 < this.currentStep) {
                            el.classList.add('completed');
                        }
                    });
                }

                completeAllSteps() {
                    document.querySelectorAll('.step').forEach(el => {
                        el.classList.remove('active');
                        el.classList.add('completed');
                    });
                }

                activateButton(id) {
                    document.querySelectorAll('.btn').forEach(btn => {
                        btn.disabled = true;
                    });

                    const button = document.getElementById(id);
                    if (button) {
                        button.disabled = false;
                    }

                    // Завжди активна кнопка скидання
                    //document.getElementById('reset').disabled = false;
                    document.getElementById('clearBalance').disabled = false;
                }

                resetButtons() {
                    document.querySelectorAll('.btn').forEach(btn => {
                        btn.disabled = true;
                    });
                }

                
                
            }

            // Ініціалізація експерименту після завантаження сторінки            
            /*document.addEventListener('DOMContentLoaded', () => {
                new VolumeExperiment();
            });*/

            const volumeExperiment = new VolumeExperiment();

            // Додавання інтерактивності до кроків
            document.querySelectorAll('.step').forEach(step => {
                step.addEventListener('click', () => {
                    const stepNumber = parseInt(step.dataset.step);
                    const tooltip = document.createElement('div');
                    tooltip.style.cssText = `
                    position: absolute;
                    background: #333;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 14px;
                    z-index: 1000;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;

                    const explanations = {
                        1: "Ціна поділки = (максимальне значення - мінімальне значення) / кількість поділок",
                        2: "Наливаємо воду до зручного для вимірювання рівня",
                        3: "Точно записуємо початковий рівень води",
                        4: "Обережно занурюємо тіло, щоб не було бризок",
                        5: "Записуємо новий рівень води після занурення",
                        6: "V = V₂ - V₁, де V₂ - кінцевий рівень, V₁ - початковий"
                    };

                    tooltip.textContent = explanations[stepNumber];
                    document.body.appendChild(tooltip);

                    const rect = step.getBoundingClientRect();
                    tooltip.style.left = `${rect.right + 10}px`;
                    tooltip.style.top = `${rect.top}px`;
                    tooltip.style.opacity = '1';

                    setTimeout(() => {
                        tooltip.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(tooltip);
                        }, 300);
                    }, 2000);
                });
            });

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
        let substanceName1 = ["Алюміній","Залізо","Золото","Латунь",
                            "Мідь","Олово","Платина","Свинець",
                            "Скло","Срібло","Цинк","Чавун"];
        let substanceDensity1 = [2700,7800,19300,8500,
                                8900,7300,21500,11300,
                                2500,10500,7100,7000];
        let substanceLiquidName1 = ["Ацетон","Бензин","Бензол", "Вода морська", 
                                    "Вода чиста","Гас","Гліцерин","Дизельне паливо",
                                    "Мастило","Мед","Олія","Нафта",
                                    "Ртуть","Спирт","Сульфатна кислота"];
        let substanceLiquidDensity1 = [790,710,880,1030,
                                        1000,800,1260,840,
                                        900,1420,900,800,
                                        13600,800,1800];
        let indexSourceBody = null;
        let indexSourceLiquid = null;
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
        let measureMassFullGlass = 0;
        let measureMassLiquid = 0;
        let sourceElement = null;

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
                if (isMass && experiment == 2) {         
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
            sourceElement = element;
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
            let density = substanceLiquidDensity1[indexSourceLiquid] / 1000;
            massId = "massBody" + experimentNumber;
            massMeasured = document.querySelector("#" + massId).textContent;
            liquidMass = massMeasured - emptyGlass.dataset.mass;
            finalWaterLevel = Math.round((liquidMass/density / 200) * 280);
            
            // Add visual representation to cylinder
            water.style.height = (finalWaterLevel) + "px";  
            fullGlass.style.display = "none"; 
            //emptyGlass.style.display = "block";   
            
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
                if(leftPanObject.name !== "Порожня склянка"){
                    volumeExperiment.activateButton('change-body2');
                }
                else{
                    emptyGlass.style.display = "none";
                    //solidBody.disabled = false;
                }
                let tbody = document.getElementById('resultCalculationLiquid');
                const row = tbody.insertRow();
                row.id = 'row' + experimentNumber;
                row.innerHTML = `
                        <td id='nameBody${experimentNumber}'>${leftPanObject.name}</td>
                        <td id='massBody${experimentNumber}'>${rightPanMass}</td>
                        <td id='volumeLiquid${experimentNumber}'>&nbsp;</td>
                    `;
                mass1 = rightPanMass;
                isMass = true;
                if(leftPanObject.name === "Порожня склянка"){
                    measureMassLiquid = measureMassFullGlass - rightPanMass;
                    document.getElementById("massBody1" + experimentNumber).innerHTML = measureMassLiquid;
                    document.querySelector("#densityBody1" + experimentNumber).innerHTML = (measureMassLiquid / volume).toFixed(3);
                    document.querySelector("#densityBody2" + experimentNumber).innerHTML = Math.round(1000 * measureMassLiquid / volume);
                    document.querySelector('#substanceBody' + experimentNumber).textContent = substanceLiquidName1[indexSourceLiquid] + "(" + substanceLiquidDensity1[indexSourceLiquid] + ")";
                }
                else{
                    measureMassFullGlass = rightPanMass;
                }
                
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
                if(leftPanObject.name !== "Порожня склянка"){
                    leftPanObject.element.style.opacity = '1';
                    leftPanObject.element.draggable = true;
                }                
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
            indexSourceLiquid = Math.floor(Math.random() * 15);
        }

        function execSolidBody() {
            experiment = 1;
            liquid.disabled = true;
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