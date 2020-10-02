# SortCut

## Instructions

This application is live on [Netlify](https://sortcut.netlify.app/), but you can also download this repository and run the project locally by following these steps:

1. Clone this repository with `git clone https://github.com/chicorycolumn/SortCut.git`
   <br/>
   If you are unsure what this means, instructions can be found [here](https://www.wikihow.com/Clone-a-Repository-on-Github) or [here](https://www.howtogeek.com/451360/how-to-clone-a-github-repository/).

2. Open the project in a code editor, and run `npm install` to install necessary packages.

3. Run `npm start` to open the project in development mode.
   <br/>
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Deploy

In general, to set up Netlify so that it deploys automatically when the Github repository is updated, follow these steps:

0. Ensure the project is initialised in a Git repository. If you are unsure what this means, instructions can be found [here](https://medium.com/@JinnaBalu/initialize-local-git-repository-push-to-the-remote-repository-787f83ff999) and [here](https://www.theserverside.com/video/How-to-create-a-local-repository-with-the-git-init-command).

1. Login to Netlify and click _New Site from Git_, then select _Github_ and then the project in question. Set the command as `npm run build`.

2. Now when you commit and push to Github, Netlify will deploy the latest version of the project automatically.

## Description

A clean and simple single-page-application which allows the user to rapidly sort a list of items into "yes" and "no" groups. The design aims to be clear and unfussy, while packing in as much utility as possible.

- The user can upload a list either by pasting it directly, or by uploading a text file. The choice of which character to separate the items in the list by is customisable.

- The user can sort their list both by clicking buttons, and by pressing keyboard shortcuts, which are customisable. The user can move already-sorted items between the lists at any time.

- The user can both download and clipboard-copy the contents of either list at any time.

- The user can undo their actions, all the way back to the beginning if they wish, and the list can be restarted or randomised. The current word is defined in a new tab when clicked on.

## Challenges

My main aim was to create something that I would get as much use as possible from. I personally sorted several thousand words using SortCut, as preparation for another project, so I had a lot of time to test and discover as-yet-unadded functionality that would make it just that little bit more powerful to use, such as customisable keyboard shortcuts, and copying to clipboard.

The main challenge this raised was that many features were to be implemented after the initial planning phase and once most of the project was already underway, which meant several focused periods of reworking the data flow and overhauling the project structure so that the right data and functions would be available where needed.

## What I learned

The importance of data management, and useful planning techniques to take forward. It was fun to further explore React and to learn more about useful interfaces such as KeyboardEvent, which I used to allow the user to set their own keyboard shortcuts, as well as working with Blobs to allow the user to upload and download lists.
