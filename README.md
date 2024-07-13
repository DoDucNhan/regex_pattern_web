# Regex Pattern Matching and Replacement

## Setup Instructions

### Backend (Django)

1. Clone the repository.
2. Navigate to the `regex_app` directory.
3. Install dependencies: `pip install -r requirements.txt`.
4. Set the OpenAI API key environment variable: `export OPENAI_API_KEY='your-openai-api-key'`.
5. Apply migrations: `python manage.py migrate`.
6. Start the development server: `python manage.py runserver`.

### Frontend (React)

1. Navigate to the `regex-frontend` directory.
2. Install dependencies: `npm install axios`.
3. Start the development server: `npm start`.

## Usage

1. Open the React application in your browser.
2. Upload a CSV or Excel file.
3. Enter the pattern you want to match in natural language.
4. Specify the replacement value.
5. Process the file to see the results.
