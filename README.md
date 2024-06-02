# Dynamic Form Handling and PDF Generation

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Frontend Details](#frontend-details)
    1. [HTML Structure](#html-structure)
    2. [CSS Styling](#css-styling)
    3. [JavaScript Functionality](#javascript-functionality)
7. [Backend Details](#backend-details)
    1. [Server Setup](#server-setup)
    2. [PDF Generation](#pdf-generation)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

This project is a web application that features a dynamic form for collecting user inputs, displaying image previews, handling form submissions, and generating a PDF document based on the collected data. The frontend is built using HTML, CSS, and JavaScript, while the backend uses Node.js and PDFKit for PDF generation.

## Features

- Dynamic form sections with real-time addition and removal of items
- Image preview functionality
- Live search for parts
- Form submission and PDF generation
- Server-side PDF creation using PDFKit

## Project Structure

/project-root
    /public
        /css
            - styles.css
        /js
            - script.js
            - PageTemplate.js
    /views
        - index.html
    - server.js
    - package.json


## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/dynamic-form-pdf-generation.git
    ```
2. Navigate to the project directory:
    ```bash
    cd dynamic-form-pdf-generation
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    node server.js
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Fill out the form, upload images, and use the search bar to find parts.
3. Submit the form to generate a PDF document based on the provided inputs.

## Frontend Details

### HTML Structure

The form is divided into multiple sections, each with specific input fields. An image preview is provided for uploaded images.

### CSS Styling

The CSS file (`styles.css`) ensures a clean and user-friendly interface, including form styling, buttons, and dynamic elements.

### JavaScript Functionality

The JavaScript file (`script.js`) includes:

- Initialization and document ready handling
- Dynamic form handling (adding/removing items)
- Image preview functionality
- Form submission logic
- Live search bar implementation

## Backend Details

### Server Setup

The backend server (`server.js`) is set up using Node.js and handles form submissions, processes data, and generates PDF files.

### PDF Generation

PDF files are generated using PDFKit based on the data received from the form submission. The PDF generation logic ensures that the collected data is appropriately formatted and presented in the resulting document.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.