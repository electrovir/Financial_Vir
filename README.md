# Financial_Vir
A personal finance categorizer in Javascript.

This is entirely a web app.  It is displayed through HTML/CSS and runs solely on Javascript.  It is intended to run inside of the [Electron](http://electron.atom.io) framework.

Everything that is entered into the app is **ONLY** stored client-side.  The data you enter is never seen by me, the data you enter is **ONLY** stored on your own computer.  While this means all your data is 100% private, it also means you will have to use this app on the same computer forever, or figure out a way to transfer the database yourself, as it is not yet implemented (but it is planned).

This is the first time I've made a real app, the first time I've used git, the first time I've written heavily in Javascript.  I've learned a lot and this app has gone through several complete refactors already as I continue to learn more.  However, I'm very pleased with how well it is working so far. I actually use this app myself for my finances!  That's why I made it.

#### Running in Electron
To install Electron globally:
npm install -g electron-prebuilt

Then in the app's directory:
electron .

#### Running in a Browser
Download all the files, then simply open "main.html" in a browser and everything else will take care of itself. 
Or go [here](http://electrovir.github.io/Financial_Vir) to use it in a browser with the current repo.

##### [To do list!](TODO.md)