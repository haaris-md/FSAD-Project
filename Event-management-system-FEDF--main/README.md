
## How can I edit this code?

There are several ways of editing your application.

**

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. 

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Backend / Database

The server (located in the `backend` folder) runs on Node/Express and by default uses **MySQL** for storage.  
On startup the code will automatically create a database and the required tables if they don't already exist, but you must supply a running MySQL server.

### Environment variables

| Variable      | Default   | Description |
|---------------|-----------|-------------|
| `DB_HOST`     | `localhost` | MySQL host |
| `DB_USER`     | `root`      | MySQL user |
| `DB_PASSWORD` | (empty)     | MySQL password |
| `DB_NAME`     | `eventdb`   | Database name |

Create the database manually if you prefer:

```sql
CREATE DATABASE eventdb;
```

When the backend first starts it will **seed the database** if tables are empty.  
Two users are created by default:

| email              | password   | role     |
|--------------------|------------|----------|
| admin@example.com  | admin      | admin    |
| student@example.com| student    | student  |

and a couple of sample events are inserted.

Then start the backend:

```sh
cd backend
npm install
npm run dev
```

The frontend will automatically talk to the backend on port 4000.


