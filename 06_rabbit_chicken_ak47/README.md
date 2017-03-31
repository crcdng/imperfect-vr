# The Rabbit, the Chicken, the AK-47.

This is part of the "Imperfect VR" workshop [https://github.com/i3games/imperfect-vr](https://github.com/i3games/imperfect-vr).

**This scene is currently work in progress and may be broken.**

This scene gets a bit more complex than the others. You can move around and interact with some of the inhabitants. A little story unfolds.

## For the technically interested:

This scene gets more complex, which means we have more stuff and logic, and the HTML code in `index.html` starts to look a bit unwieldy. This is partly because HTML has a rather extensive syntax. For example, to describe a platform made of a box and a cylinder we have to write:

```
<a-entity id="platform4" position="30 15 30">
  <a-box width="6" depth="6" height="28"></a-box>
  <a-cylinder position="0 15 0" radius="27" height="2" color="#3c2703"></a-cylinder>
<a-entity>
```
What if we could write this a bit more compact like in the following piece of code?

```
a-entity#platform4(position='30 15 30')
  a-box(width='6', depth='6', height='28')
  a-cylinder(position='0 15 0', radius='27', height='2', color='#3c2703')
```

Actually, we can. We can write the VR scene in a language called (Pug)[https://pugjs.org/] and then let the computer translate it into HTML. For this short snippet, the difference may not look dramatic, but we already can see that Pug is more pleasant to eye. There are no closing tags and no pointy brackets.

This is more obvious when you compare `index.html` with `src/index.pug`. There are other benefits that come along with it. So I switched to this method for building this scene. The trade-off is that we have to learn about and install more development tools. This is topic for an  "advanced" workshop and won't be covered here.

The good think is, you can completely ignore this stuff and just use `index.html` and the code in `src/index.js`, play around with it, edit it and learn from it.  

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

# Third-Party Licenses
(see third-party-licenses)
