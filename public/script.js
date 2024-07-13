document.addEventListener('readystatechange', (event) =>{
    if (document.readyState === 'interactive') {
        function collectAdditionalCosts() {
            const additionalCosts = [];
            const additionalCostItems = document.querySelectorAll('.additional-cost-item');
            additionalCostItems.forEach(item => {
                const costDescription = item.querySelector('input[name="additionalCostDescription[]"]').value;
                const costAmount = item.querySelector('input[name="additionalCostAmount[]"]').value;
                additionalCosts.push({ description: costDescription, amount: costAmount });
            });
            return additionalCosts;
        }

        const addItems=document.getElementById('add-items');
        const addItemsContainer=document.getElementById('additional-costs-container');
        addItems.addEventListener('click',()=>{
            // Create a new div to hold the additional cost item
            const additionalCostItem = document.createElement('div');
            additionalCostItem.classList.add('additional-cost-item');
    
            // Create an input for the cost description
            const costDescriptionInput = document.createElement('input');
            costDescriptionInput.type = 'text';
            costDescriptionInput.name = 'additionalCostDescription[]';
            costDescriptionInput.placeholder = 'Cost Description';
            costDescriptionInput.classList.add('df');
            costDescriptionInput.style.marginBottom=0;
            
            // Create an input for the cost amount
            const costAmountInput = document.createElement('input');
            costAmountInput.type = 'text';
            costAmountInput.name = 'additionalCostAmount[]';
            costAmountInput.placeholder = 'Cost Amount';
            costAmountInput.classList.add('df');
            costAmountInput.style.marginBottom=0;
    
            // Create a button to remove the additional cost item
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.innerText = 'Remove';
            // removeButton.id='removeButton';
            removeButton.addEventListener('click', () => {
                addItemsContainer.removeChild(additionalCostItem);
            });
    
            // Append the inputs and the remove button to the additional cost item div
            additionalCostItem.appendChild(costDescriptionInput);
            additionalCostItem.appendChild(costAmountInput);
            additionalCostItem.appendChild(removeButton);
    
            // Append the additional cost item div to the container
            addItemsContainer.appendChild(additionalCostItem);
        });

        let imageDataUrl = '';
        let imageDataUrlSolution = '';
        // document.getElementById('imageInput').addEventListener('change', function(event) {
        //     const file = event.target.files[0];
        //     if (file && file.type == 'image/png') {
        //         const reader = new FileReader();
        //         reader.onload = function(e) {
        //             const imagePreview = document.getElementById('imagePreview');
        //             imagePreview.src = e.target.result;
        //             imagePreview.style.display = 'block';
        //             imageDataUrl = e.target.result;  // Store the base64 string
        //         };
        //         reader.readAsDataURL(file);
        //     } else {
        //         alert('Please select a valid image file.');
        //     }
        // });

        // document.getElementById('imageInputSolution').addEventListener('change', function(event) {
        //     const file = event.target.files[0];
        //     if (file && file.type == 'image/png') {
        //         const reader = new FileReader();
        //         reader.onload = function(e) {
        //             const imagePreviewSolution = document.getElementById('imagePreviewSolution');
        //             imagePreviewSolution.src = e.target.result;
        //             imagePreviewSolution.style.display = 'block';
        //             imageDataUrlSolution = e.target.result;  // Store the base64 string
        //         };
        //         reader.readAsDataURL(file);
        //     } else {
        //         alert('Please select a valid image file.');
        //     }
        // });
        document.getElementById('imageInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            handleImageUpload(file, 'imagePreview', 'imageDataUrl');
        });
    
        document.getElementById('imageInputSolution').addEventListener('change', function(event) {
            const file = event.target.files[0];
            handleImageUpload(file, 'imagePreviewSolution', 'imageDataUrlSolution');
        });
    
        function handleImageUpload(file, previewId, dataUrlVar) {
            if (file && file.type == 'image/png') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imagePreview = document.getElementById(previewId);
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    window[dataUrlVar] = e.target.result;  // Store the base64 string
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file.');
            }
        }
        document.getElementById('dynamicForm').addEventListener('submit', function(event) {
            event.preventDefault();
            //data collection
            const section1 = {};
            const section2 = {};
            const section3 = {};
            const section4 = {};
            const additionalQuestions = {};
            const selectedParts = {};
            const tnc={};
            const additionalCosts = collectAdditionalCosts();
            const section1Inputs = document.querySelectorAll('.section1 .df');
            section1Inputs.forEach(function(input) {
                section1[input.id] = input.value;
            });
            const section2Inputs = document.querySelectorAll('.section2 .df');
            section2Inputs.forEach(function(input) {
                const lbl=document.querySelector("label[for=" + input.id + "]");
                section2[input.id] = [input.value,lbl.textContent];
            });
            const section3Inputs = document.querySelectorAll('.section3 .df');
            section3Inputs.forEach(function(input) {
                const lbl=document.querySelector("label[for=" + input.id + "]");
                section3[input.id] = [input.value,lbl.textContent];
            });
            const section4Inputs = document.querySelectorAll('.section4 .df');
            section4Inputs.forEach(function(input) {
                section4[input.id] = input.value;
            });
            const additionalQuestionsInputs = document.querySelectorAll('#additionalQuestions input');
            additionalQuestionsInputs.forEach(function(input) {
                const lbl=document.querySelector("label[for=" + input.id + "]");
                additionalQuestions[input.id] = [input.value,lbl.textContent];
            });
            const selectedPartInputs = document.querySelectorAll('.section4 #selected-parts li');
            selectedPartInputs.forEach(function(input) {
                const text=input.querySelector('.part-name');
                const qty=input.querySelector('.quantity-input');
                const cost=input.querySelector('.part-cost');
                selectedParts[text.textContent]=[cost.textContent,qty.value];
            });
            const tncInput = document.querySelectorAll('.section5 .df');
            tncInput.forEach(function(input) {
                const lbl=document.querySelector("label[for=" + input.id + "]");
                tnc[input.id] = [input.value,lbl.textContent];
            });
            const format = document.getElementById('format').value;
            const data = {
                section1,
                section2,
                section3,
                section4,
                selectedParts,
                additionalQuestions,
                additionalCosts,
                imageDataUrl,
                imageDataUrlSolution,
                tnc,
                'format':format
            };
            fetch('http://localhost:3000/submit-form', {
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
                a.download = format === 'pdf' ? 'Proposal.pdf' : 'Proposal.docx';
                document.body.appendChild(a);
                const clickHandler = () => {
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                        a.removeEventListener('click', clickHandler);
                    }, 150);
                };
                a.addEventListener('click', clickHandler, false);
                a.click();
                return a;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        
        // Search bar implementation
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const partsList = document.getElementById('parts-list');
        searchInput.addEventListener('input', function(event) {
            const searchText = event.target.value;
            if (searchText.length > 0) {
                fetch(`/search-parts?searchTerm=${searchText}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        console.log('Full response:', response);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Search results data:', data); // Adjusted to log data directly
                        displaySearchResults(data);
                    })
                    .catch(error => {
                        console.error('Error fetching search results:', error);
                    });
            } else {
                searchResults.innerHTML = '';
            }
        });

        function displaySearchResults(results) {
            searchResults.innerHTML = ''; 
            if (results.length === 0) {
                searchResults.textContent = 'No results found.';
            } else {
                results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.textContent = `${result.name} - Cost: ${result.cost}`;
                    resultItem.classList.add('search-result');
                    resultItem.addEventListener('click', function() {
                        addPart(result);
                    });
                    searchResults.appendChild(resultItem);
                });
            }
        }

        function addPart(part) {
            const partItem = document.createElement('li');
            partItem.classList.add('selected-part');
            partItem.dataset.partId = part._id;

            const partInfo = document.createElement('span');
            partInfo.textContent = part.name;
            partInfo.classList.add('part-name');

            const partCost = document.createElement('span');
            partCost.textContent = part.cost;
            partCost.classList.add('part-cost');

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.value = '1';
            quantityInput.classList.add('quantity-input');

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', function() {
                removePart(part._id);
            });

            partItem.appendChild(partInfo);
            partItem.appendChild(partCost);
            partItem.appendChild(quantityInput);
            partItem.appendChild(removeButton);
            partsList.appendChild(partItem);
        }

        function removePart(partId) {
            const partItem = document.querySelector(`.selected-part[data-part-id="${partId}"]`);
            if (partItem) {
                partItem.remove();
            }
        }

    
        //adding placeholder
        window.onload = function() {
            var inputs = document.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute('placeholder', 'Enter');
            }
        }
    
        function updateAdditionalQuestions() {
            var orderCategory = document.getElementById('order-category').value;
            var additionalQuestionsDiv = document.getElementById('additionalQuestions');
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

                    <label for="powder-change-frequency">No. of times powder is changed in one day</label><br>
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
