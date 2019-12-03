# vuejs-overlay

![Vue.js Overlay](https://user-images.githubusercontent.com/1655312/70054926-8d469d80-15e9-11ea-9fdc-c8f65bf9bc85.png)

`Vue.js Overlay` is a practical, modern and convenient `overlay` (`popup`) `Vue.js` component.

# What?
It is a stylish popup component for `Vue.js` that you can easily use in your projects.  
The most important features are flexible, modern, animated, stable, lightweight.

# Install

```
npm install vuejs-overlay --save
```

# Usage

```html
<div id="app">
    <overlay :opened="opened" :visible="visible" @closed="opened = visible = false">
        My popup
    </overlay>
    
    <button @click="opened = visible = true">Open Popup</button>
</div>
```

```js
// ES6
import {Overlay} from 'vuejs-overlay.js';

new Vue({
    el: '#app',
    data() {
        return {
            opened: false,
            visible: false
        }
    },
    components: {
        Overlay
    }
});
```

# Configurations
You can make the configurations with `props`.

| Configuration                     | Type             | Default                  | Description                                                   |
| ----------------------------------| ---------------- | ------------------------ | ------------------------------------------------------------- |
| animate                           | String, Boolean  | false                    | You can choose which animation the popup will open and close. |
| backdrop                          | Boolean          | true                     | Specifies whether the popup has a backdrop.                   |
| close-on-escape                   | Boolean          | true                     | This is to close the popup with the `escape key`.             |
| close-by-backdrop-click           | Boolean          | true                     | This is to close the popup when the backdrop is clicked.      |
| closeable                         | Boolean          | true                     | Closing feature of the popup. You can use it in critical form operations. |
| opened                            | Boolean          | false                    | Specifies the popup is opened.                                |
| header                            | String, Boolean  | false                    | Used to determine the header text of the popup.               |
| visible                           | Boolean          | false                    | Specifies that internal elements are loaded of the popup.     |

#### Available `animate` options:
`"bounce"`, `"fade"`, `"slide-down"`, `"slide-left"`, `"slide-right"`, `"slide-up"`, `"zoom-in"`, `"zoom-out"`, `false`.

```html
<overlay animate="zoom-in" :opened="opened" :visible="visible" @closed="opened = visible = false">
    My popup
</overlay>
```

#### Usage asynchronously:
Let's take an example of content data with ajax. In this example we used [`vuejs-ajax`](https://github.com/fattihkoca/vuejs-ajax) library. 

```html
<div id="app">
    <overlay :opened="opened" :visible="visible" @closed="onClosed">
        <span v-text="text"></span>
    </overlay>
    
    <button @click="openHandle">Open Popup</button>
</div>
```

```js
import ajax from "vuejs-ajax";
import {Overlay} from 'vuejs-overlay.js';
Vue.use(ajax);

new Vue({
    el: '#app',
    data() {
        return {
            opened: false,
            visible: false,
            text: null,
        }
    },
    methods: {
        openHandle() {
            this.overlayOpened = true;

            Vue.ajax.get("example.com/my-request-url").then(response => {
                this.text = response.data;
                this.visible = true;
            });
        },
        onClosed() {
            this.opened = false;
            this.visible = false;
        }
    },
    components: {
        Overlay
    }
});
```

# Events
| Configuration                     | Type             | Description                                                   |
| ----------------------------------| ---------------- | ------------------------------------------------------------- |
| @closed                           | Callback         | Triggers when the popup is closed. We recommend that you use this to ensure stable operation of this component when closing the popup. |
| @opened                           | Callback         | Triggers when the popup is opened. |

```html
<overlay :opened="opened" :visible="visible" @closed="opened = visible = false" @opened="someCallback">
    My popup
</overlay>
```

# License
[MIT](LICENSE)

Copyright (c) 2019 [Fatih Koca](http://fattih.com)