<head>
    <title>Hello World</title>
</head>


# Code Example Demo
Following code will be identified and injected into HTML by `imdoc`.

<h3 class="demo-1">HTML Content</h3>
``` html
<div id="foo"></div>
<div id="bar"></div>
```

<h3 class="demo-1">CSS Content</h3>
``` css
#foo, #bar {
    display: inline-block;
    height: 100px;
    width: 100px;
    background-color: lightcoral;
}
```

<h3 class="demo-1">JS Content</h3>
``` js
document.getElementById("foo").innerHTML = "hello foo";
document.getElementById("bar").innerHTML = "hello bar";
```

<section id="demo-1"></section>
