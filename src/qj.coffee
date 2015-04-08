QJ = (selector) ->
  return selector if QJ.isDOMElement(selector)
  document.querySelectorAll selector

QJ.isDOMElement = (el) ->
  el and el.nodeName?

QJ.isNodeList = (nodes) ->
  result = Object::toString.call(nodes)
  # modern browser such as IE9 / firefox / chrome etc.
  if result == '[object HTMLCollection]' or result == '[object NodeList]'
    return true
  #ie 6/7/8
  if typeof nodes != 'object'
    return false
  # detect length and item
  if !('length' in nodes) or !('item' in nodes)
    return false
  # use the trick NodeList(index),all browsers support
  try
    if nodes(0) == null or nodes(0) and nodes(0).tagName
      return true
  catch e
    return false
  false

rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
QJ.trim = (text) ->
  if text == null then "" else (text + "").replace rtrim, ""
rreturn = /\r/g
QJ.val = (el, val) ->
  if arguments.length > 1
    el.value = val
  else
    ret = el.value
    if typeof(ret) == "string"
      ret.replace(rreturn, "")
    else
      if ret == null then "" else ret

QJ.preventDefault = (eventObject) ->
  if typeof eventObject.preventDefault is "function"
    eventObject.preventDefault()
    return
  eventObject.returnValue = false
  false

QJ.normalizeEvent = (e) ->
  original = e
  e =
    which: if original.which? then original.which
    # Fallback to srcElement for ie8 support
    target: original.target or original.srcElement
    preventDefault: -> QJ.preventDefault(original)
    originalEvent: original
    data: original.data or original.detail

  if not e.which?
    e.which = if original.charCode? then original.charCode else original.keyCode
  return e

QJ.on = (element, eventName, callback) ->
  if @isNodeList element
    # handle multiple elements
    for el in element
      QJ.on el, eventName, callback
    return

  if eventName.match(" ")
    # handle multiple event attachment
    for multEventName in eventName.split(" ")
      QJ.on element, multEventName, callback
    return

  originalCallback = callback
  callback = (e) ->
    e = QJ.normalizeEvent(e)
    originalCallback(e)

  if element.addEventListener
    return element.addEventListener(eventName, callback, false)

  if element.attachEvent
    eventName = "on" + eventName
    return element.attachEvent(eventName, callback)

  element['on' + eventName] = callback
  return

QJ.addClass = (el, className) ->
  return (QJ.addClass(e, className) for e in el) if el.length

  if (el.classList)
    el.classList.add(className)
  else
    el.className += ' ' + className
QJ.hasClass = (el, className) ->
  if el.length
    hasClass = true
    for e in el
      hasClass = hasClass and QJ.hasClass(e, className)
    return hasClass

  if (el.classList)
    el.classList.contains(className)
  else
    new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
QJ.removeClass = (el, className) ->
  return (QJ.removeClass(e, className) for e in el) if el.length

  if (el.classList)
    for cls in className.split(' ')
      el.classList.remove(cls)
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
QJ.toggleClass = (el, className, bool) ->
  return (QJ.toggleClass(e, className, bool) for e in el) if el.length

  if bool
    QJ.addClass(el, className) unless QJ.hasClass(el, className)
  else
    QJ.removeClass el, className

QJ.append = (el, toAppend) ->
  return (QJ.append(e, toAppend) for e in el) if el.length

  el.insertAdjacentHTML('beforeend', toAppend)

QJ.find = (el, selector) ->
  # can only have one scope
  el = el[0] if el instanceof NodeList or el instanceof Array

  try
    el.querySelectorAll(selector)
  catch Exception
    console.log 'Invalid Selector has been passed to querySelectorAll()'

QJ.trigger = (el, name, data) ->
  try
    ev = new CustomEvent(name, {detail: data})
  catch e
    ev = document.createEvent('CustomEvent')
    # jsdom doesn't have initCustomEvent, so we need this check for
    # testing
    if ev.initCustomEvent
      ev.initCustomEvent name, true, true, data
    else
      ev.initEvent name, true, true, data

  el.dispatchEvent(ev)

module.exports = QJ
