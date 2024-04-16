document.addEventListener('readystatechange', (event) =>{
    if (document.readyState === 'interactive') {
        document.getElementById('profile-btn').addEventListener('click', function() {
            var menu = document.getElementById('profile-menu');
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
            } else {
                menu.classList.add('show');
            }
        });
    
        document.getElementById('dynamic-form').addEventListener('submit', function(event) {
            event.preventDefault();
        
            var clientName = document.getElementById('client-name').value;
            var poc = document.getElementById('poc').value;
            var clientAddress = document.getElementById('client-address').value;
            var orderCategory = document.getElementById('order-category').value;
            var quotationNumber = document.getElementById('quotation-number').value;
            var clientRefId = document.getElementById('client-ref-id').value;
            var subject = document.getElementById('subject').value;
            var project = document.getElementById('project').value;
            var discussionDate = document.getElementById('discussion-date').value;
        
            // Collect additional questions
            var additionalQuestions = document.getElementById('additional-questions').querySelectorAll('select');
            var additionalData = Array.from(additionalQuestions).reduce((obj, field) => {
                obj[field.name] = field.value;
                return obj;
            }, {});
        
            var data = {
                poc: poc,
                clientName: clientName,
                clientAddress: clientAddress,
                orderCategory: orderCategory,
                quotationNumber: quotationNumber,
                clientRefId: clientRefId,
                subject: subject,
                project: project,
                discussionDate: discussionDate,
                additionalData: additionalData
            };
        
            fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'FirstPage.pdf' || 'download';
                const clickHandler = () => {
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                        a.removeEventListener('click', clickHandler);
                    }, 150);
                };
                a.addEventListener('click', clickHandler, false);
                a.click();
                return a;
            });
        });
        
            
    
        //adding placeholder
        window.onload = function() {
            var inputs = document.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute('placeholder', 'Enter');
            }
        }
    
        document.getElementById('order-category').addEventListener('change', function(event) {
            var orderCategory = event.target.value;
            var additionalQuestionsDiv = document.getElementById('additional-questions');
            additionalQuestionsDiv.innerHTML = ''; // Clear previous questions
    
            if (orderCategory === 'visual-inspection') {
                additionalQuestionsDiv.innerHTML = `
                    <label for="object-length">Object Length:</label><br>
                    <select id="object-length" name="object-length">
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                    </select><br>
    
                    <label for="height-of-object">Height of Object:</label><br>
                    <select id="height-of-object" name="height-of-object">
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="tall">Tall</option>
                    </select><br>
    
                    <label for="frequency-of-objects">How many objects need to be inspected per day?</label><br>
                    <select id="frequency-of-objects" name="frequency-of-objects">
                        <option value="<100"><100</option>
                        <option value="100-500">100-500</option>
                        <option value=">500">>500</option>
                    </select><br>
    
                    <label for="lighting-condition">Lighting Conditions:</label><br>
                    <select id="lighting-condition" name="lighting-condition">
                        <option value="dim">Dim</option>
                        <option value="variable">Variable</option>
                        <option value="well-lit">Well Lit</option>
                    </select><br>
    
                    <label for="error-margin">Margin of Error?</label><br>
                    <select id="error-margin" name="error-margin">
                        <option value="<1%"><1%</option>
                        <option value="1-5%">1-5%</option>
                        <option value=">5%">>5%</option>
                    </select><br>
    
                    <label for="arm-length">Arm Length:</label><br>
                    <select id="arm-length" name="arm-length">
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                    </select><br>
    
                    <label for="arm-speed">Arm Speed:</label><br>
                    <select id="arm-speed" name="arm-speed">
                        <option value="slow">Slow</option>
                        <option value="medium">Medium</option>
                        <option value="fast">Fast</option>
                    </select><br>
    
                    <label for="gripper-type">Gripper Type:</label><br>
                    <select id="gripper-type" name="gripper-type">
                        <option value="claw">Claw</option>
                        <option value="vacuum">Vacuum</option>
                        <option value="magnetic">Magnetic</option>
                    </select><br>
                `;
            } else if (orderCategory === 'spray-painting' || orderCategory === 'bin-picking') {
                additionalQuestionsDiv.innerHTML = `
                    <label for="object-length">Object Length:</label><br>
                    <select id="object-length" name="object-length">
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                    </select><br>
                    <label for="height-of-object">Height of Object:</label><br>
                    <select id="height-of-object" name="height-of-object">
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="tall">Tall</option>
                    </select><br>
    
                    <label for="frequency-of-objects">How many objects per day?</label><br>
                    <select id="frequency-of-objects" name="frequency-of-objects">
                        <option value="<100"><100</option>
                        <option value="100-500">100-500</option>
                        <option value=">500">>500</option>
                    </select><br>
                `;
    
                if (orderCategory === 'spray-painting') {
                    additionalQuestionsDiv.innerHTML += `
                        <label for="angle-of-painting">Angle of Painting:</label><br>
                        <select id="angle-of-painting" name="angle-of-painting">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select><br>
    
                        <label for="paint-type">Paint-type:</label><br>
                        <select id="paint-type" name="paint-type">
                            <option value="water-based">Water based</option>
                            <option value="oil-based">Oil based</option>
                            <option value="other">Other</option>
                        </select><br>
    
                        <label for="layer-thickness">What is the desired thickness of the paint layer?</label><br>
                        <select id="layer-thickness" name="layer-thickness">
                            <option value="thin">Thin</option>
                            <option value="medium">Medium</option>
                            <option value="thick">Thick</option>
                        </select><br>
                    `;
                }
                if (orderCategory === 'bin-picking') {
                    additionalQuestionsDiv.innerHTML += `
                    <label for="gripper-type">Gripper Type:</label><br>
                    <select id="gripper-type" name="gripper-type">
                        <option value="claw">Claw</option>
                        <option value="vacuum">Vacuum</option>
                        <option value="magnetic">Magnetic</option>
                    </select><br>
                    `;
                }
            }
        });
    }
});
