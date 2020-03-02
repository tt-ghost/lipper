# lipper

light weight ripple library

## Demo

[Demo](http://fe1024.com/demos/lipper/)

## Usage

- `script`

```html
<!doctype html>
<html>
  <body>
    <button id='btn'>Button Container</button>
    <scirpt src='./lipper.min.js'></scirpt>
    <scirpt>
      lipper.init({selector: ['button', '.container']})
    </scirpt>
  </body>
</html>
```

- `ES6`

```javascript
import lipper from 'lipper'
lipper.init({
  selector: ['button', '.container']
})
```

## API

- `lipper.init(option)`: Initialization
- `lipper.put(option)`: Set parameters. Same as `init`
- `lipper.reset()`: Reset default `option`
- `lipper.destroy()`: Remove event listener


### `option`

|parameter name|default value|Required|detail|
|-----|-----|-----|---|
|selector|--|yes|CSS selector. String or string array.|
|duration|`1.5`|no|Duration. The unit is second.|
|radius|`50`|no|Diffusion radius. The unit is px|
|color|`rgba(250, 250, 250, .5)`|no|The color of lipper|
|center|`false`|no|Whether lipper in the container|
|overflow|`false`|no|Whether to continue lipper outside the container|
|zindex|`1000`|no|`z-index` value|

