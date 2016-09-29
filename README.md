# imdoc
markdown documentation generator


## Install
``` text
npm install -g imdoc
```


## Usage

### Basic
Generate HTML from markdown file(s):

``` text
imdoc file1.md file2.md ...
```

`imdoc` generates HTML in the same path of corresponding markdown file path.

### Code Example
`imdoc` supports generating bootstrap-flavored HTML/CSS/JS front end code examples. Run 

``` text
imdoc example.md
```

in `imdoc` source folder to see how it works.

### Watcher
File watcher on single markdown file is also supported:

``` text
imdoc watch file.md
```


## Changelog
* `1.1.0`:
    * Add watcher
    * Add code example generator
    * Update `Github2.css` theme
* `1.0.1`:
    * Add basic markdown convert support
* `1.0.0`:
    * Init repository.


## License
MIT
