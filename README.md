# Regex Pattern Matching and Replacement Web Application

This project is a web application built using Django and React for regex pattern matching and replacement in CSV files. It integrates a Large Language Model (LLM) from [Meta-Llama-3-8B-Instruct](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct) to convert natural language descriptions into regex patterns. A brief demonstration can be found [here](https://drive.google.com/file/d/1ywDRVDhIErjTG_BLwSeFe11rq8na32fp/view?usp=sharing).

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DoDucNhan/regex_pattern_web.git
   cd regex_pattern_web
   ```

2. **Backend Setup (Django):**

   - Ensure Python 3.x and pip are installed.
   - Install required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

   - Set up Django environment variables and configuration.

3. **Frontend Setup (React):**

   - Navigate to the `frontend` directory:

    ```bash
    cd regex_frontend
    ```

   - Install dependencies using npm:

    ```bash
    npm install axios react-bootstrap bootstrap
    ```

4. **Hugging Face API Token Setup:**

   - Obtain an API token from Hugging Face following their documentation. **(Remember to accept meta terms to be granted access to their models)**
   - Replace the token in `settings.py`:

    ```python
    # regex_app/settings.py
    HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY', 'YOUR_KEY')
    ```

## Usage

**NOTE**: On your first run, it will take time to download the checkpoint for the LLAMA 3 model.

1. **Running the Development Servers:**

   - Navigate to the `regex_app` directory.

    ```bash
    cd regex_app
    ```

   - Start the Django backend server:

    ```bash
    python manage.py runserver
    ```

   - Start the React frontend server (in another terminal window):

    ```bash
    cd regex_frontend
    npm start
    ```

2. **Using the Application:**

   - Access the application in your web browser at `http://localhost:3000`.
   - Upload a CSV or Excel file and describe the pattern you want to match in natural language.
   - The application will convert your description into a regex pattern using Meta-Llama-3-8B-Instruct.
   - Download the processed CSV file.

## Acknowledgments

- Meta-Llama-3-8B-Instruct for providing the LLM capabilities.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
