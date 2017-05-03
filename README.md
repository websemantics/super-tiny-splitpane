```
╭─╮ ┬ ┬ ╭─╮ ╭─╮ ┬─╮   ╭┬╮ ┬ ╭╮╭ ╭─╮   ╭─╮ ╭─╮ ┬   ┬ ╭┬╮ ╭─╮ ╭─╮ ╭╮╭ ╭─╮  
╰─╮ │ │ ├─╯ ├┤  ├┬╯    │  │ │││ ├┤    ╰─╮ ├─╯ │   │  │  ├─╯ ├─┤ │││ ├┤   
╰─╯ ╰─╯ ┴   ╰─╯ ┴╰─    ┴  ┴ ╯╰╯ ╰─╯   ╰─╯ ┴   ┴─╯ ┴  ┴  ┴   ┴ ┴ ╯╰╯ ╰─╯  
Under 2kb and without dependencies 
```
> Bare minimum implementation of a Splitpane UI with supports for horizontal and vertical layouts.

[![Live demo](https://img.shields.io/badge/Live%20demo-%E2%86%92-9D6EB3.svg?style=flat-square)](https://websemantics.github.io/super-tiny-splitpane)

## Getting Started

1. Include `splitpane.js` in an html page,

```html
<script src="splitpane.js"></script>
```

 2. Add the following markup,

 ```html
 <div class="splitpane">                 <!-- for vertical splitpane add  `vertical` -->
   <div style="width: 50%"></div>        <!-- class and set `height` of first child -->
   <div class="handle"></div>
   <div></div>
 </div> 
```

3. Finally, include style rules, 

```css
html, body { height: 100% }
.splitpane {width: 100%; height: 100% }
.handle {background-color: lightgrey; }
.handle:hover {background-color: grey }
```

## More Examples

- [Basic Horizontal](https://websemantics.github.io/super-tiny-splitpane/examples/basic-horizontal.html)
- [Basic Vertical](https://websemantics.github.io/super-tiny-splitpane/examples/basic-vertical.html)

## Support

Need help or have a question? post a questions at [StackOverflow](https://stackoverflow.com/questions/tagged/super-tiny-splitpane+websemantics)

*Please don't use the issue trackers for support/questions.*

## Contribution

More than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :)

## License

[MIT license](http://opensource.org/licenses/mit-license.php)
Copyright (c) Web Semantics, Inc.