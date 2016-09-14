#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var mkdirp = require('mkdirp');
var hl = require('highlight.js');

if (process.argv.length < 3) {
    console.log("usage: imdoc filename.md");
    return;
}

var staticPath = path.join(__dirname, 'static', '/');
var header = fs.readFileSync(staticPath + 'header.html', { encoding: 'utf-8' });
var highlightCSS = fs.readFileSync(staticPath + 'Darcula.css', { encoding: 'utf-8' });
var themeCSS = fs.readFileSync(staticPath + 'GitHub2.css', { encoding: 'utf-8' });

var buildHTML = function(mdPath, mdName) {
    marked.setOptions({
        sanitize: false,
        highlight: function(code, language) {
            if (language === 'js') {
                language = 'javascript';
            }
            return hl.highlightAuto(code, [language]).value;
        }
    });

    var markdown = fs.readFileSync(path.join(mdPath, mdName), { encoding: 'utf-8' });
    var html = [header.replace('{{title}}', mdName), marked(markdown)].join('\n');

    var distPath = path.join(mdPath, '/doc');
    var distCssPath = path.join(distPath, '/css');
    mkdirp.sync(distCssPath);

    fs.writeFile(path.join(distPath, mdName.split('.')[0] + '.html'), html, function(err) {
        if (err) throw err;
    });
    fs.writeFile(path.join(distCssPath, 'Darcula.css'), highlightCSS, function(err) {
        if (err) throw err;
    });
    fs.writeFile(path.join(distCssPath, 'GitHub2.css'), themeCSS, function(err) {
        if (err) throw err;
    });
};

for (var i = 2; i < process.argv.length; i++) {
    buildHTML(process.cwd(), process.argv[i]);
}
