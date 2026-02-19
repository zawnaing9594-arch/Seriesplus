# StreamGenius Cinema Website

This is a modern streaming platform built with React, TypeScript, and Vite.

## 🚀 How to Deploy to Netlify (Free)

Since this is a React application using Vite, it needs to be "built" before it can be hosted. You cannot just upload the source files directly.

### Option 1: The Easy Way (via GitHub) - Recommended

1.  **Push to GitHub**: Create a repository on GitHub and push all these files to it.
2.  **Connect to Netlify**:
    *   Go to [Netlify.com](https://www.netlify.com) and sign up/login.
    *   Click **"Add new site"** > **"Import an existing project"**.
    *   Select **GitHub** and choose your repository.
3.  **Deploy**:
    *   Netlify will detect the `netlify.toml` file included in this project.
    *   It will automatically set the Build Command to `npm run build` and Publish Directory to `dist`.
    *   Click **Deploy Site**.

### Option 2: Manual Upload (Netlify Drop)

If you don't want to use GitHub, you must build the project on your computer first:

1.  Install Node.js on your computer.
2.  Open a terminal in the project folder.
3.  Run `npm install` to install dependencies.
4.  Run `npm run build` to create the website.
5.  This will create a new folder called **`dist`**.
6.  Drag and drop the **`dist`** folder (not the source folder) into Netlify Drop.

## 🔑 Admin Setup

*   **Default PIN**: `1234`
*   Use the "Lock" icon in the footer to access the Admin Dashboard.
*   You can upload movies, add episodes, and change the site name/logo from there.

## 🛠 Project Structure

*   `src/`: Source code
*   `dist/`: Built files (created after running build)
*   `netlify.toml`: Configuration for Netlify deployment
