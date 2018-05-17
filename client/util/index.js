'use strict'

export const regex = {
  thread: /(.*)\/(.*)\/thread\/(\d*)(?:#(\d*))?/
}

export function createClamp (min, max) {
  return (num) => Math.min(max, Math.max(min, num))
}

export function $ (selector) {
  return document.querySelector(selector)
}

export function collector (arr) {
  return function collect (key) {
    return arr.map(obj => obj[key])
  }
}

export function returnTo4chan () {
  const [,, board, threadNo] = regex.thread.exec(window.location.href)
  const url = `https://boards.4chan.org/${board}/thread/${threadNo}`

  window.location.href = url
}

export function boardFromUrl (url) {
  return regex.thread.exec(url)[1]
}

export function getSelectedOpt ($select) {
  return $select.options[$select.selectedValue].value
}

export function interact (slt, event, handler) {
  $(slt).addEventListener(event, e => {
    e.preventDefault()

    handler(e)
  })
}
