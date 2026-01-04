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
                        }
                        
                        this.reset();
                        this.updateStep(6);
                        updateBalanceStatus();
                    

                    /*document.getElementById('volume').textContent = `${volume} мл`;

                    const result = document.getElementById('result');
                    result.innerHTML = `
                    <h3>Результат експерименту</h3>
                    <p>Об'єм твердого тіла: <strong>${volume} мл</strong></p>
                    <p>Метод заміщення води дозволяє точно визначити об'єм твердих тіл неправильної форми!</p>
                `;
                    result.classList.add('show');*/

                    //this.completeAllSteps();
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

                    // Очищення вимірювань
                    //document.getElementById('initial-level').textContent = '-';
                    //document.getElementById('final-level').textContent = '-';
                    //document.getElementById('volume').textContent = '-';

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