/**
 * 
 * ╭─╮ ┬ ┬ ╭─╮ ╭─╮ ┬─╮   ╭┬╮ ┬ ╭╮╭ ╭─╮   ╭─╮ ╭─╮ ┬   ┬ ╭┬╮ ╭─╮ ╭─╮ ╭╮╭ ╭─╮  
 * ╰─╮ │ │ ├─╯ ├┤  ├┬╯    │  │ │││ ├┤    ╰─╮ ├─╯ │   │  │  ├─╯ ├─┤ │││ ├┤   
 * ╰─╯ ╰─╯ ┴   ╰─╯ ┴╰─    ┴  ┴ ╯╰╯ ╰─╯   ╰─╯ ┴   ┴─╯ ┴  ┴  ┴   ┴ ┴ ╯╰╯ ╰─╯  
 * Under 2kb and without dependencies 
 * 
 * Bare minimum implementation of a Splitpane UI with supports for 
 * horizontal and vertical layouts
 * 
 * @copyright (c) 2016-2017, Web Semantics, Inc.
 * @author Adnan M.Sagar, PhD. <adnan@websemantics.ca>
 * @license Distributed under the terms of the MIT License.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) { define(factory) }
    else if (typeof module === 'object' && module.exports) { module.exports = factory() }
    else { root.Splitpane = factory() }
}(this, function () {
    'use strict'

    var defaults = {  /* Library defaults, change using the `defaults` static method */
        disable: false,
        handle: 5,
        minHeight: 100,
        minWidth:100,
        templates : [
        [ /* vertical layout: top, handle and bottom */
        'left:0; right:0; top:0; height: {ratio}%; padding-bottom: {half}px',
        'left:0; right:0; top:{ratio}%; width: 100%; margin-top: -{half}px; height: {handle}px; cursor: {cursor}; z-index: 1',
        'left:0; right:0; bottom:0; height: {supplement}%; padding-top: {half}px'],
        [ /* horizontal layout: left, handle and right */
        'top:0; bottom:0; left:0; width: {ratio}%; padding-right: {half}px',
        'top:0; bottom:0; left:{ratio}%; margin-left: -{half}px; width: {handle}px; cursor: {cursor}; z-index: 1',
        'top:0; bottom:0; right:0; width: {supplement}%; padding-left: {half}px']],
        cursor: ['row-resize', 'col-resize']}

    /**
     * Create a Splitpane instance.
     *
     * @param {Node} el - Splitpane DOM node
     * @param {Number} minHeight - Smallest pane height (top/bottom)
     * @param {Number} minWidth - Smallest pane height (left/right)
     * 
     * #### Note
     * Process splitpanes, calculate width or height of the handle (depending on orientation) and apply the 
     * appropriate styles to children
     * 
     * #### Example
     * ```js
     * var split = new Splitpane( '#app' )
     * ```
     * @property {Number} orien - Splitpane orientation: 0 = vertical, 1 = horizontal (*defult)
     * @property {Number} min - Splitpane pane's minimum width (horizontal) or height (vertical)
     * @property {ClientRect} container - Splitpane bounding client rectangle
     * @property {NodeList} children - Splitpane children, [0]=top/left pane, [1]=handle, [2]=bottom/right pane
     * @property {String} cursor - Handle mouse cursor value
     * @property {Number} handle - Handle thickness (`width` or `height` depending on orientation)
     * @constructor
     */
    var self = function (el, options) {

        var orien      = el.classList.contains('vertical') ? 0 : 1
        var min        = defaults[['minHeight', 'minWidth'][orien]]
        var container  = el.getBoundingClientRect()
        var children   = el.querySelectorAll(':scope > div')
        var cursor     = window.getComputedStyle(children[1]).getPropertyValue('cursor')
        var handle     = children[1].getBoundingClientRect()[['height', 'width'][orien]]
        
        /* set defaults for handle thickness and mouse cursor if not set */
        handle = handle < 1 || handle === container[['height', 'width'][orien]] ? defaults.handle : handle
        cursor = cursor === 'auto' ? defaults.cursor[orien] : cursor,

        /* Handle */ children[1].addEventListener('mousedown', function (event) {
            var max = container[['height', 'width'][orien]] - min

            var listeners = [ 
                function mousemove(event) {  
                    var xy = event[['pageY', 'pageX'][orien]] - container[['top', 'left'][orien]]

                    event.preventDefault()
                    _compile(( xy > min ? xy < max ? xy : max : min ) / container[['height', 'width'][orien]])
                },
                function mouseup( event ) { 
                    listeners.forEach(function (l) { document.removeEventListener(l.name, l)
                    window.dispatchEvent(new Event('resize')) /* inform everybody */ }) 
            }]
            listeners.forEach(function (l) { document.addEventListener(l.name, l) }) 
        })

        /**
         * @function _compile - Updates Splitpane children dimension
         * 
         * @param {Number} ratio - The portion (a percentage) that the first child (top/left)
         *                         occupies within the overall width/height of the parent pane
         * @private
         */
        function _compile(ratio) {
            children.forEach(function (child, i) {
                child.style = 'position: absolute; ' + _mustach( defaults.templates[orien][i], {
                    half:  handle / 2, 
                    handle: handle,
                    cursor: cursor,
                    ratio: ratio  * 100,
                    supplement: (1 - ratio) * 100
                }) 
            })
        }

        /**
         * @function _mustach -  Super tiny mustach-like template parser with nested paths support (i.e. x.y.z)
         * 
         * @param {String} template - Template string
         * @param {Object} data - Context data
         * @param {strig} path - Nestet path prefix
         * @returns {String}
         * @private
         */
        function _mustach(template, data, path) {
            path = path || ''
            Object.keys(data || {}).forEach(function (key) {
                template = typeof data[key] === 'object' ?
                    _mustach(template, data[key], path + key + '.') :
                    template.replace(new RegExp("{ *?" + path + key + " *?}", 'g'), data[key])
            })
            return template
        }

        /**
         * @function resize -  Public function to adjust splitpane size
         * @public
         */
        this.resize = function(){
            container = el.getBoundingClientRect()
        }

        _compile( children[0].getBoundingClientRect()[['height', 'width'][orien]] / 
                  container[['height', 'width'][orien]])
    }

    /**
     * @function defaults - Override class defaults
     * 
     * @param {Object} options - Name value pairs
     * @static
     */
    self.defaults = function (options) { 
        Object.keys( options || {} ).forEach( function( key ){ defaults[key] = options[key] })
    }

    window.addEventListener("load", function(event) { /* activate all splitpanes, register resize event */
        var panes = [].slice.call(document.querySelectorAll('.splitpane') || []).map(
                            function (splitpane) { return new Splitpane(splitpane) })
        
        panes.length > 0 && !defaults.disable && window.addEventListener('resize', 
                            function(event){ panes.forEach(function(pane){ pane.resize() })}, true)
    })    
    
    return self
}))