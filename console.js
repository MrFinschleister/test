let box = document.getElementById('console')
let currentlyChanging = false
let clickedLocationX
let clickedLocationY
function changing() {
    currentlyChanging = true
}
class Para {
    constructor(content) {
        let para = document.createElement('p')
        para.innerHTML = content
        para.style.width = "30vw"
        para.style.overflowWrap = "break-word"
        document.getElementById('consoleContent').appendChild(para)
    }
}
let listeners = {

}
function start() {
    if (box && window.location.href.split('#')[1] === "console") {
        document.body.setAttribute('id', "body")
        box.remove()
        box = document.createElement('div')
        box.setAttribute('id', "console")
        box.style.height = "90vh"
        box.style.width = "30vw"
        box.style.backgroundColor = "rgba(0, 0, 0, .9)"
        box.style.position = "absolute"
        box.style.right = "1vh"
        box.style.top = "1vh"
        box.style.overflowY = "hidden"
        box.style.overflowX = "hidden"
        box.style.border = "1px black solid"
        let input = document.createElement('input')
        input.setAttribute('onchange', "readCommand(this), this.value = '' ")
        input.setAttribute('onclick', 'changing()')
        input.placeholder = "Input Command"
        input.type = "text"
        input.setAttribute('id', "consoleCommand")
        input.style.width = "25vw"
        input.style.position = "absolute"
        input.style.bottom = "0.5vh"
        input.style.backgroundColor = "rgba(65, 65, 65, .5)"
        input.style.border = "0"
        input.style.color = "white"
        let hr = document.createElement('hr')
        hr.style.width = "30vw"
        hr.style.position = "absolute"
        hr.style.top = "84vh"
        let consoleContent = document.createElement('div')
        consoleContent.style.height = "85vh"
        consoleContent.style.overflowY = "scroll"
        consoleContent.style.overflowX = "clip"
        consoleContent.style.color = "lightgray"
        consoleContent.setAttribute('id', "consoleContent")
        let resetButton = document.createElement('button')
        resetButton.setAttribute('onclick', "boxReset()")
        resetButton.setAttribute('id', "resetButton")
        resetButton.style.width = "1vw"
        resetButton.style.height = "1vw"
        resetButton.style.backgroundColor = "rgba(0, 0, 0, .9)"
        resetButton.style.position = "absolute"
        resetButton.style.right = "0"
        document.body.appendChild(box)
        box.appendChild(resetButton)
        box.appendChild(input)
        box.appendChild(hr)
        box.appendChild(consoleContent)
        window.addEventListener('keydown', pressed)
    }
}
function boxReset() {
    box.style.left = "auto"
    box.style.right = "1vh"
    box.style.top = "1vh"
}
function boxClicked(e) {
    clickedLocationX = e.offsetX
    clickedLocationY = e.offsetY
    box.addEventListener('mousemove', boxMoved)
    box.addEventListener('mouseup', boxUnclicked)
}
function boxUnclicked(e) {
    box.removeEventListener('mousemove', boxMoved)
    box.removeEventListener('mouseup', boxUnclicked)
}
function boxMoved(e) {
    box.style.left = (e.pageX - clickedLocationX) + "px"
    box.style.top = (e.pageY - clickedLocationY) + "px"
}
let descriptions = {
    help: function() {
        new Para("help: help [all || desired command]")
        new Para("~~~ lists all functions or explains a desired command")
    },
    changeStyle: function() {
        new Para("changeStyle: changeStyle [elementId] [style] [value]")
        new Para("~~~ changes the style of a desired element")
    },
    changeContent: function() {
        new Para("changeContent: changeContent [elementId] [replace || add] [value]")
        new Para("~~~ changes the content of a desired element")
    },
    createElement: function() {
        new Para("createElement: createElement [elementType] [elementId] [parentElement] [(optional) elementContent]")
        new Para("~~~ creates an element of the desired type and ID under a desired parent element")
    },
    removeElement: function() {
        new Para("removeElement: removeElement [elementId]")
        new Para("~~~ removes the element with the desired id")
    },
    setAttribute: function() {
        new Para("setAttribute: setAttribute [elementId] [attribute] [value]")
        new Para("~~~ sets the desired attribute of the desired element")
    },
    bindTo: function() {
        new Para("bindTo: bindTo [key] [javascript code]")
        new Para("~~~ binds a javascript code snippet to a specified key")
    },
    unbind: function() {
        new Para("unbind: unbind [key]")
        new Para("~~~ unbinds a previously bound key")
    },
    mode: function() {
        new Para("mode: mode [regular || collapse]")
        new Para("~~~ switches between regular and collapsed console view")
    },
    clear: function() {
        new Para("clear: clear") 
        new Para("~~~ clears the console")
    },
    drag: function() {
        new Para("drag: drag [true || false]")
        new Para("~~ determines whether or not the console can be dragged")
    }

}
let comm = {
    help: function(input) {
        if (input === "all") {
            new Para(Object.keys(comm).join(", "))
            new Para("~~~ type \"help [desired command]\" for more info")
        } else {
            descriptions[input[1]]()
        }
    },
    changeStyle: function(input) {
        let newInput = input.slice(3, input.length).join(" ")
        document.getElementById(input[1]).style[input[2]] = newInput
        new Para("--- \"" + input[2] + "\" style of element \"" + input[1] + "\" changed to \"" + newInput + "\"")
    },
    changeContent: function(input) {
        let newInput = input.slice(3, input.length).join(" ")
        if (input[2] === "replace") {
            document.getElementById(input[1]).innerHTML = newInput
            new Para("--- content of element \"" + input[1] + "\" changed to \"" + newInput + "\"")
        } else if (input[2] === "add") {
            document.getElementById(input[1]).innerHTML += newInput
            new Para("--- \"" + newInput + "\" added to content of element \"" + input[1] + "\"")
        }
    },
    createElement: function(input) {
        let el = document.createElement(input[1])
        el.setAttribute('id', input[2])
        document.getElementById(input[3]).appendChild(el)
        if (input[4]) {
            let newInput = input.slice(4, input.length).join(" ")
            el.innerHTML = newInput
            new Para("--- new \"" + input[1] + "\" element with ID \"" + input[2] + "\" created under \"" + input[3] + "\" with content of \"" + newInput + "\"")
        } else {
            new Para("--- new \"" + input[1] + "\" element with ID \"" + input[2] + "\" created under \"" + input[3] + "\"")
        }
    },
    removeElement: function(input) {
        document.getElementById(input[1]).remove()
        new Para("--- \"" + input[1] + "\" element removed")
    },
    setAttribute: function(input) {
        let newInput = input.slice(3, input.length).join(" ")
        document.getElementById(input[1]).setAttribute(input[2], newInput)
        new Para("--- \"" + input[2] + "\" attribute of \"" + input[1] + "\" set to \"" + newInput + "\"")
    },
    bindTo: function(input) {
        let newInput = input.slice(2, input.length).join(" ")
        listeners[input[1]] = function() {eval(newInput)}
        new Para("--- \"" + input[1] + "\" key bound to code \"" + newInput + "\"")
    },
    unbind: function(input) {
        listeners[input[1]] = null
        new Para("--- \"" + input[1] + "\" key unbound")
    },
    mode: function(input) {
        if (input[1] === "regular") {
            box.style.height = "90vh"
        } else if (input[1] === "collapse") {
            box.style.height = "5vh"
        }
    },
    clear: function(input) {
        document.getElementById('consoleContent').innerHTML = ""
    },
    drag: function(input) {
        if (input[1] === "true") {
            box.addEventListener('mousedown', boxClicked)
        } else if (input[1] === "false") {
            box.removeEventListener('mousedown', boxClicked)
            boxUnclicked(null)
        }
    }
}
function readCommand(el) {
    currentlyChanging = false
    let input = el.value
    if (input[0] === "/") {
        input = input.split("/")
        input.shift()
        eval(input[0])
    } else {
        if (input === "help") {
            comm.help("all")
        } else {
            input = input.split(" ")
            if (!comm[input[0]]) {
                new Para("Unrecognised command \"" + comm[input[0]] + "\" in \"" + input.join(" ") + "\"")
                new Para("~~~ type \"help\" to list commands")
            } else {
                comm[input[0]](input)
            }
        }
    }
    document.getElementById("consoleContent").scrollTop = document.getElementById("consoleContent").scrollHeight
}
function pressed(e) {
    if (listeners[e.key] != undefined && !currentlyChanging) {
        listeners[e.key]()
    }
}
start()