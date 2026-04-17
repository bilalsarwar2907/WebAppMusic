# WebAppMusic
#  WebAppMusic - Music Record Repository

A simple and responsive web application for managing a music collection. Users can view, search, and sort records, while administrators can add, update, and delete entries.

##  Features
* **Live Data:** Fetches music records from a REST API (Azure or Localhost).
* **Authentication:** JWT-based login system with Role-Based Access Control (Admin vs. User).
* **Dynamic UI:** Built with **Vue.js 3** for a fast, reactive experience.
* **Search & Sort:** Filter records by title or artist and sort by any column.
* **Admin Tools:** Full CRUD operations (Create, Read, Update, Delete) for authorized admins.

##  Tech Stack
* **Frontend:** HTML5, CSS3 (Bootstrap 5), Vue.js 3, Axios.
* **Backend Support:** RESTful API (C# / .NET).
* **Testing:** Selenium WebDriver with XUnit for UI testing.

##  Getting Started

### 1. Prerequisites
You need a local web server to run the frontend. I recommend using the **Live Server** extension in VS Code.

### 2. Installation
1. Clone this repository.
2. Open the folder in VS Code.
3. Start your local API (ensure it is running on `http://localhost:5102`).
4. Right-click `index.html` and select **"Open with Live Server"**.

## 🌐 Deployment & Hosting

The project is fully deployed and has been verified across multiple environments:

### ☁️ Cloud Hosting
* **API (Backend):** Hosted on **Azure App Service**. It provides the RESTful endpoints for record management and JWT authentication.
* **Frontend:** Deployed and tested on **Simply.com**, ensuring compatibility with standard web hosting environments.

###  Environment Testing
The application supports switching between environments via the `isLocal` toggle in the logic:
* **Production:** Connects to `https://restmusicrepoapi.azurewebsites.net`
* **Development:** Connects to `http://localhost:5102`

The **Selenium UI Tests** have been executed against both environments to ensure that CORS settings, database connectivity, and authentication work perfectly in the cloud as well as locally.

### 3. Running UI Tests
The project includes Selenium tests located in the test project folder.
* Ensure the web app is running at `http://localhost:5500`.
* Run the tests using the Visual Studio Test Explorer or `dotnet test` in the terminal.

##  Project Structure
* `index.html` - The main entry point and UI structure.
* `index.js` - Vue.js logic, API calls, and state management.
* `index.css` - Custom styling.
* `.github/` - Contains GitHub Actions for CI/CD.

---
Developed as part of the REST Music Repository project.