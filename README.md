# Imperfect VR workshop

This is a collection of examples for my "Imperfect VR" workshop, built with A-Frame.

[The Imperfect VR Manifesto](https://github.com/i3games/imperfect-vr/blob/master/Imperfect%20VR%20Manifesto.pdf) - [Github Repository](https://github.com/i3games/imperfect-vr) - [See it online](https://i3games.github.io/imperfect-vr/)

Imperfect VR means we are not aiming for a perfect reality but will have fun in the virtual. Cheap 3D assets. Blocky textures. Weird sounds. Stumble around with a smartphone strapped to your face. Forget VR mainstream. Motion sickness will not be avoided but guaranteed. This workshop is based on the premise that everyone who can slide a smartphone into a [Cardboard](https://vr.google.com/cardboard/) can make VR experiences, even if you haven't written a single line of code before.

Imperfect VR is inspired by ["Imperfect Cinema"](http://www.imperfectcinema.com/) by Allister Gall which in turn is inspired by the essay ["For an imperfect cinema"](http://www.ejumpcut.org/archive/onlinessays/JC20folder/ImperfectCinema.html) by Julio García Espinosa.

## VR scenes for the workshop

* 00 Do it Yourself - the scene for our coding exercise
* 01 Hello VR World - result of our coding exercise
* 02 360 Degrees - demonstrates a 360 image / video
* 03 Basic Scene - based on the A-Frame documentation [Build with Basic HTML](https://aframe.io/docs/0.5.0/guides/). It has animation, gaze-based interaction (looking at the cube will make it react) and sound.
* 04 Imperfect Treasures, based on the [Google Cardboard example](https://developers.google.com/vr/android/get-started). This is similar to the last scene, but has a little bit more logic (code) in it to create a little playful experience.
* 05 The Reality of the Virtual featuring Slavoj Žižek, Dubstep, Nyan Cat and more. More interaction, more Dubstep, more everything.
* 06 Rabbit Chicken, AK 47 (work in progress). This scene is my playground for more experimentation with storytelling and movement in VR. Expect it to be ... imperfect.

## Context and Plans

What I am aiming at are different formats - Imperfect VR jams and Imperfect VR workshops. The workshops are geared towards beginners - starting without any assumption about your background or coding experience. We go through the absolute basics, while advanced participants can get support to realize their ideas. We also discuss current politics of VR, perception, imperfection and a bit of Nietzsche.

A full day or two day workshop would be an option for teaching JavaScript, components etc.

The jams will be like game jams, people coming together for a day or a weekend and creating stuff together. The spirit of all this is captured in the [The Imperfect VR Manifesto](https://github.com/i3games/imperfect-vr/blob/master/Imperfect%20VR%20Manifesto.pdf).  

Now make a VR!

## Technical remarks

[A-Frame](https://aframe.io/) is a beginner-friendly, but capable open source framework made by people from Mozilla. It allows creating Virtual Reality experiences from HTML markup and JavaScript code. It is based on a entity-component-system architecture and has a friendly and growing community.

Each example scene here is self-contained and has all the files it needs in its directory structure (including fonts, images, movies). I want it to be able to run offline, i.e. in a local network without internet connection.

The code is written in ES5. I prefer writing in ES6, however ES6 requires transpilation, setting up a toolchain with npm, Babel, webpack etc. This workshop is not the place for this.

The main scene used to navigate to the individual scenes currently only makes sense for viewing the scenes on a desktop browser where you can go back and forth without interruption. The fullscreen VR mode on your mobile device must be triggered by an user action. This means you have to take the phone out of the cardboard and tap on the VR symbol each time a new scene is loaded.  

## Third-Party Licenses

* A-Frame: Copyright (c) 2015 A-Frame Authors, MIT License
* Uses [k-frame components](https://github.com/ngokevin/k-frame): Copyright (c) 2016 Kevin Ngo, MIT License
* see also the README's and third-party-licenses in some of the examples.
