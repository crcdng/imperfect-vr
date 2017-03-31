# The Rabbit, the Chicken, the AK-47.

This is part of the "Imperfect VR" workshop [https://github.com/i3games/imperfect-vr](https://github.com/i3games/imperfect-vr).

**This scene is currently work in progress and may be broken.**

This scene gets a bit more complex than the others. You can move around and interact with some of the inhabitants. A little story unfolds.

## For the technically interested:

In this scene we have more elements and also more logic written in JavaScript. In "04 Imperfect Treasures" we have already seen some code inside `<script>` tags. The recommended way for coding with A-Frame however is to pack our code into components, which can be shared and later be reused.

We have used components who were written by other people in our scenes before, especially in "05 Reality of the Virtual". For this scene we start coding them ourselves, starting with the component that is used when we follow the rabbit at the beginning of the scene. The code is in `js/aframe-follow-component.js` and there is a tutorial how to write it on the [A-Frame website](https://aframe.io/docs/0.5.0/guides/writing-a-component.html).

Also the HTML code in `index.html` starts to look a bit unwieldy. This is partly because HTML has a rather extensive syntax. For example, to describe one platform made of a box and a cylinder we have to write:

```
<a-entity id="platform4" position="30 15 30">
  <a-box width="6" depth="6" height="28"></a-box>
  <a-cylinder position="0 15 0" radius="27" height="2" color="#3c2703"></a-cylinder>
<a-entity>
```

That is still ok, but what if we could write this a bit more compact like in the following piece of code?

```
a-entity#platform4(position='30 15 30')
  a-box(width='6', depth='6', height='28')
  a-cylinder(position='0 15 0', radius='27', height='2', color='#3c2703')
```

Actually, we can. We can write the VR scene in a language called (Pug)[https://pugjs.org/] and then use a tool to translate it into HTML. For this short snippet, the difference may not look dramatic, but we already can see that Pug is more pleasant to the eye. There are no closing tags and no pointy brackets.

This becomes more obvious when you compare `index.html` with `src/index.pug`. There are other benefits that come along with it, for example we can spot errors and typos earlier. So I switched to this method for building the scene. The trade-off is that I had to install and use more development tools. This is a topic for an "advanced" workshop and it won't be covered here.

The good thing is, you can completely ignore all this stuff and - like in all the other scenes - just use `index.html` and the component code inside the `js` directory to play around, edit and learn from it.  

# Third-Party Licenses

* A-Frame: Copyright (c) Mozilla
* [k-frame components](https://github.com/ngokevin/k-frame): Copyright (c) Kevin Ngo, MIT License
* [physics system](https://github.com/donmccurdy/aframe-physics-system): Copyright (c) Don McCurdy, MIT License
* [extras](https://github.com/donmccurdy/aframe-extras): Copyright (c) Don McCurdy, MIT License
* [gradient sky](https://github.com/zcanter/aframe-gradient-sky): Copyright (c) Zac Canter, MIT License

## 3D-Models
* AK-47: Copyright (c) AJAY896, 3dexport.com
* rabbit, chick: Copyright (c) platyperson, sketchfab.com [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)

## Textures
* heart: Public Domain

(some of them are described in detail in the directory third-party-licenses)
