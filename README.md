# SortCut

## Description

A clean and simple Single Page Application for rapidly sorting a list of items into "yes" and "no". The design aims to be clear and unfussy while packing in as much utility as possible.

- The user can upload a list by pasting it directly, and also by uploading a text file, with selectable options for how to separate words.

- The user can sort their list by clicking buttons and also with customisable keyboard shortcuts. Sorted items can be moved between lists at any time.

- The user can download and also clipboard-copy the contents of either list at any time.

- The user can undo their actions, all the way back to the beginning if they wish, and the list can be restarted or randomised. Google results for the current word can be opened in a new tab.

## Instructions

This application is live on [Netlify](https://sortcut.netlify.app/), but you can also download this repository and run the project locally by following these steps:

1. Fork this repository by clicking the button labelled 'Fork' on the [project page](https://github.com/chicorycolumn/SortCut.git).
   <br/>
   Copy the url of your forked copy of the repository, and run `git clone the_url_of_your_forked_copy` in a Terminal window on your computer, replacing the long underscored word with your url.
   <br/>
   If you are unsure, instructions on forking can be found [here](https://guides.github.com/activities/forking/) or [here](https://www.toolsqa.com/git/git-fork/), and cloning [here](https://www.wikihow.com/Clone-a-Repository-on-Github) or [here](https://www.howtogeek.com/451360/how-to-clone-a-github-repository/).

2. Open the project in a code editor, and run `npm install` to install necessary packages. You may also need to install [Node.js](https://nodejs.org/en/) by running `npm install node.js`.

3. Run `npm start` to open the project in development mode.
   <br/>
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Deploy

General instructions for taking a **React project** and hosting it on **Netlify** for **automatic deployment** are as follows:

0. Ensure the project is initialised in a Git repository. If you are unsure what this means, instructions can be found [here](https://medium.com/@JinnaBalu/initialize-local-git-repository-push-to-the-remote-repository-787f83ff999) and [here](https://www.theserverside.com/video/How-to-create-a-local-repository-with-the-git-init-command).

1. Login to Netlify and click _New Site from Git_, then select _Github_ and then the project in question. Set the command as `npm run build`.

Now when you commit and push to Github, Netlify will deploy the latest version of the project automatically.

## Built with

- [JavaScript](https://www.javascript.com/) - The primary coding language
- [VisualStudioCode](https://code.visualstudio.com/) - The code editor

- [Netlify](https://www.netlify.com/) - The hosting service

- [React](https://reactjs.org/) - The frontend framework
- [CSS Modules](https://github.com/css-modules/css-modules) - The design organisation system
