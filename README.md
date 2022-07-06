# electron-video

The purpose of the project is to simply show a display bug with Intel Gen 11
CPUs running electron.

### Expected Behavior
When you have two div elements with videos stacked on top of each other and 
use css z-index to transition between them the div with the higher z-index 
should display on top.

### Gen 11 Intel Behavior
The div with the lower z-index displays on top.

### Temporary Fix
By simply adding one more element, a 1px by 1px div with a mostly transparent 
background, on top with higher z-index than both videos, the z-indexs on the
divs with videos now display correctly.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
