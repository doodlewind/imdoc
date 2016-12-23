#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var marked = require('marked')
var mkdirp = require('mkdirp')
var hl = require('highlight.js')
var cheerio = require('cheerio')
var _ = require('lodash')

var staticPath = path.join(__dirname, 'static', '/')
var header = fs.readFileSync(staticPath + 'header.html', { encoding: 'utf8' })
var highlightCSS = fs.readFileSync(staticPath + 'Darcula.css', { encoding: 'utf8' })
var themeCSS = fs.readFileSync(staticPath + 'GitHub2.css', { encoding: 'utf8' })

/**
 * get code blocks from markdown source
 * @param markdown, markdown string
 * @return object, demo items with their html/css/js code block
 */
var getDemos = function (markdown) {
  var demos = {}

    // get all demo id
  var $ = cheerio.load(marked(markdown))
  var demoNames = $('section').map(function () {
    return $(this).attr('id')
  }).get()

    // find h3 whose class name matches demo id
    // then add its following code to demo item
  var tokens = marked.lexer(markdown)

  for (var i = 0; i < tokens.length - 1; i++) {
    var token = tokens[i]
    $ = cheerio.load(token.text || '')
    if (token.type === 'paragraph') {
      _.each(demoNames, function (name) {
        if ($('h2, h3, h4').hasClass(name)) {
          if (!_.has(demos, name)) {
            demos[name] = { html: '', css: '', js: '' }
          }
          var code = tokens[i + 1]
          demos[name][code.lang] = code.text
        }
      })
    }
  }

  return demos
}

/**
 * generate HTML from markdown file path
 * @param mdPath, markdown file path
 * @param mdName, markdown file name
 */
var buildHTML = function (mdPath, mdName) {
  marked.setOptions({
    sanitize: false,
    highlight: function (code, language) {
      if (language === 'js') {
        language = 'javascript'
      }
      return hl.highlightAuto(code, [language]).value
    }
  })

  var markdown = fs.readFileSync(path.join(mdPath, mdName), { encoding: 'utf8' })
  var html = marked(markdown)
    // inject common header into HTML
  var $ = cheerio.load(html, { decodeEntities: false })
    // <head> is required
  $('head').append(header)
    // inject demo codes into HTML
  var demos = getDemos(markdown)
  _.each(demos, function (demo, id) {
    $('#' + id)
            .append(demo.html)
            .append('<style>' + demo.css + '</style>')
            .append('<script>' + demo.js + '</script>')
  })

  $('a').attr('target', '_blank')
  html = $.html()

  var distPath = path.join(mdPath, '/doc')
  var distCssPath = path.join(distPath, '/css')
  mkdirp.sync(distCssPath)

  fs.writeFile(path.join(distPath, mdName.split('.')[0] + '.html'), html, 'utf8', function (err) {
    if (err) throw err
  })
  fs.writeFile(path.join(distCssPath, 'Darcula.css'), highlightCSS, 'utf8', function (err) {
    if (err) throw err
  })
  fs.writeFile(path.join(distCssPath, 'GitHub2.css'), themeCSS, 'utf8', function (err) {
    if (err) throw err
  })
  // console.log(html)
}

// do watch / build
var i
if (process.argv.length == 4 && process.argv[2] === 'watch') {
  buildHTML(process.cwd(), process.argv[3])
  fs.watchFile(path.join(process.cwd(), process.argv[3]), { interval: 500 }, function () {
    buildHTML(process.cwd(), process.argv[3])
    var d = new Date()
    console.log('build complete at', [d.getHours(), d.getMinutes(), d.getSeconds()].join(':'))
  })
} else {
  for (i = 2; i < process.argv.length; i++) {
    buildHTML(process.cwd(), process.argv[i])
  }
}
