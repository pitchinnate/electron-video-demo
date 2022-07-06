# electron-video-demo

The purpose of the project is to simply show a display bug with Intel Gen 11
CPUs running electron on Windows 10. Other operating systems could be affected
however we have not tested.

### Expected Behavior
When you have two div elements with videos stacked on top of each other and 
use css z-index to transition between them the div with the higher z-index 
should display on top.

### Gen 11 Intel Behavior
The div with the lower z-index displays on top.

### How to test
Create a build using `yarn build` and install 
(`dist_electron\electron-video-demo Setup 0.1.0.exe`) on a Windows 10 computer with 
an Intel Gen 11 CPU. On the homepage click the link for `Test Video Broken` and you
will see the videos will not match the description given at the top. Click anywhere
on the video to go back to the Homepage. Now click the link for `Test Video Fix` and
you will see the videos now match the description given at the top.

### Temporary Fix
By simply adding one more element (a 1px by 1px div with a mostly transparent
background) on top with higher z-index than both videos, the z-index's on the
divs with videos now work correctly.

```html
<div class="intelFix"></div>
```
```css
.intelFix {
    position: absolute;
    z-index: 30;
    width: 1px;
    height: 1px;
    background: rgba(0,0,0,0.1);
  }
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and builds an electron installer for production
```
yarn build
```
