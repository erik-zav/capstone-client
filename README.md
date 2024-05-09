# Stark Chatbot Setup Instructions

Before you begin, ensure that **Node.js** and **npm package manager** are installed on your machine.

## Installation Steps

1. **Clone the repository using SSH**: 
If you haven't already, [generate an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) and add it to your GitHub account.
Clone the Stark Chatbot repository to your local machine using the SSH command:
     ```
     git clone git@github.com:<username>/stark-chatbot.git



2. **Navigate to the Repository**: 
Change to the directory with:
     ```
    cd path/to/stark-chatbot



3. **Install dependencies**: 
Install the necessary dependencies by running:
   ```
   npm install



4. **Start the development server**: 
Start the development server with (we are using the concurrently library to build our react project and start the node.js server with a single command. https://www.npmjs.com/package/concurrently/v/7.5.0 ):
   ```
   npm run dev


This starts the Node.js server at localhost:3001 and loads the React project.

5. **Access the project**: 
Open your web browser and navigate to:
   ```
   http://localhost:5173/
