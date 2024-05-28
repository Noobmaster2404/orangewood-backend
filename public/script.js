document.addEventListener('readystatechange', (event) =>{
    if (document.readyState === 'interactive') {
        document.getElementById('imageInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type=='image/png') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imagePreview = document.getElementById('imagePreview');
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file.');
            }
        });
        document.getElementById('dynamic-form').addEventListener('submit', function(event) {
            event.preventDefault();
            var inputs=document.querySelectorAll('#dynamic-form .df, #additional-questions input');
            var data = {};
            inputs.forEach(function(input) {
                data[input.id] = input.value;
            });
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
    
        function updateAdditionalQuestions() {
            var orderCategory = document.getElementById('order-category').value;
            var additionalQuestionsDiv = document.getElementById('additional-questions');
            additionalQuestionsDiv.innerHTML = ''; // Clear previous questions

            if (orderCategory === 'spray-painting') {
                additionalQuestionsDiv.innerHTML = `
                    <label for="product-or-service">Type- Product or Service based</label><br>
                    <input type="text" id="product-or-service" name="product-or-service"><br>

                    <label for="sku">No of SKUs</label><br>
                    <input type="text" id="sku" name="sku"><br>

                    <label for="batch-size">Average Batch Size</label><br>
                    <input type="text" id="batch-size" name="batch-size"><br>

                    <label for="geometry">Object Geometry: 2D/3D/Both</label><br>
                    <input type="text" id="geometry" name="geometry"><br>

                    <label for="feeding">Feeding: Manual/Semi-automated/Fully automated</label><br>
                    <input type="text" id="feeding" name="feeding"><br>

                    <label for="conveyor-type">Type of Conveyor Line</label><br>
                    <input type="text" id="conveyor-type" name="conveyor-type"><br>

                    <label for="conveyor-speed">Range of Speed Conveyor</label><br>
                    <input type="text" id="conveyor-speed" name="conveyor-speed"><br>

                    <label for="article-dimensions">Article Dimensions</label><br>
                    <input type="text" id="article-dimensions" name="article-dimensions"><br>

                    <label for="loading-method">Loading Method</label><br>
                    <input type="text" id="loading-method" name="loading-method"><br>

                    <label for="baking-time">Baking Time</label><br>
                    <input type="text" id="baking-time" name="baking-time"><br>

                    <label for="powder-change-frequency">No. of times powder is changed in a day</label><br>
                    <input type="text" id="powder-change-frequency" name="powder-change-frequency"><br>

                    <label for="article-weight-dimensions">Weight and Dimensions of Article</label><br>
                    <input type="text" id="article-weight-dimensions" name="article-weight-dimensions"><br>

                    <label for="coating-thickness">Desired Coating Thickness</label><br>
                    <input type="text" id="coating-thickness" name="coating-thickness"><br>

                    <label for="article-material">Material of Article</label><br>
                    <input type="text" id="article-material" name="article-material"><br>

                    <label for="booth-dimensions">PCBooth Dimensions</label><br>
                    <input type="text" id="booth-dimensions" name="booth-dimensions"><br>

                    <label for="openings-number">No. of Openings</label><br>
                    <input type="text" id="openings-number" name="openings-number"><br>

                    <label for="openings-dimensions">Dimension of Openings</label><br>
                    <input type="text" id="openings-dimensions" name="openings-dimensions"><br>

                    <label for="hanging-provision">Is there provision for hanging the article?</label><br>
                    <input type="text" id="hanging-provision" name="hanging-provision"><br>

                    <label for="space-for-robot">Is there space to deploy the robot?</label><br>
                    <input type="text" id="space-for-robot" name="space-for-robot"><br>

                    <label for="robot-reach-extension">Do we need to extend the reach of the robot?</label><br>
                    <input type="text" id="robot-reach-extension" name="robot-reach-extension"><br>

                    <label for="qc-method">QCCheck Method</label><br>
                    <input type="text" id="qc-method" name="qc-method"><br>

                    <label for="daily-production-target">Daily Production Target</label><br>
                    <input type="text" id="daily-production-target" name="daily-production-target"><br>

                    <label for="operating-hours">Current Operating Hours/Shifts</label><br>
                    <input type="text" id="operating-hours" name="operating-hours"><br>

                    <label for="production-target">Daily/Monthly Production Target</label><br>
                    <input type="text" id="production-target" name="production-target"><br>

                `;
            } else if (orderCategory === 'bin-picking') {
                additionalQuestionsDiv.innerHTML = `
                    <label for="object-type">Types of Objects:</label><br>
                    <input type="text" id="object-type" name="object-type"><br>

                    <label for="gripper-type">Gripper Type:</label><br>
                    <input type="text" id="gripper-type" name="gripper-type"><br>

                    <label for="object-length">Object Length:</label><br>
                    <input type="text" id="object-length" name="object-length"><br>

                    <label for="height-of-object">Height of Object:</label><br>
                    <input type="text" id="height-of-object" name="height-of-object"><br>

                    <label for="frequency-of-objects">How many objects per day?</label><br>
                    <input type="text" id="frequency-of-objects" name="frequency-of-objects"><br>

                    <label for="object-description">Description of the objects</label><br>
                    <input type="text" id="object-description" name="object-description"><br>
                `;
            }else {
                additionalQuestionsDiv.innerHTML = `
                    <label for="setup">Details about current setup/process/sequence of operation</label><br>
                    <input type="text" id="setup" name="setup"><br>

                    <label for="object-length">Object Length:</label><br>
                    <input type="text" id="object-length" name="object-length"><br>

                    <label for="height-of-object">Height of Object:</label><br>
                    <input type="text" id="height-of-object" name="height-of-object"><br>

                    <label for="frequency-of-objects">How many objects need to be inspected per day?</label><br>
                    <input type="text" id="frequency-of-objects" name="frequency-of-objects"><br>

                    <label for="lighting-condition">Lighting Conditions:</label><br>
                    <input type="text" id="lighting-condition" name="lighting-condition"><br>

                    <label for="error-margin">Margin of Error?</label><br>
                    <input type="text" id="error-margin" name="error-margin"><br>

                    <label for="arm-length">Arm Length:</label><br>
                    <input type="text" id="arm-length" name="arm-length"><br>

                    <label for="arm-speed">Arm Speed:</label><br>
                    <input type="text" id="arm-speed" name="arm-speed"><br>

                    <label for="gripper-type">Gripper Type:</label><br>
                    <input type="text" id="gripper-type" name="gripper-type"><br>

                    <label for="operations">Operations to be performed:</label><br>
                    <input type="text" id="operations" name="operations"><br>
                `;
            }
        }
        document.getElementById('order-category').addEventListener('change', updateAdditionalQuestions);

        // Call the function once to display the questions for the default selected option
        updateAdditionalQuestions();
    }
});
