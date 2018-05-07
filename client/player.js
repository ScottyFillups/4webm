'use strict'

import * as axios from 'axios'
import keycode from 'keycode'
import boards from '4chan-boards'
import Playlist from './playlist'
import { collector } from './util'

class Player {
  constructor (dom) {
    this._$video = dom.video
    this._$status = dom.status
    this._$title = dom.title
    this._$loop = dom.loop
    this._index = 0
    this._webmUrls = []
    this._filenames = []
    this._playlist = new Playlist(dom.playlist)
    this._thumbnails = false

    this._$video.addEventListener('canplay', this._$video.play)
    this._$video.addEventListener('ended', this.next.bind(this))
    this._$loop.addEventListener('click', (e) => {
      this.loop = this._$loop.checked
    })
  }

  async load (threadUrl) {
    const threadRegex = /(.*)\/(.*)\/thread\/(\d*)(?:#(\d*))?/g
    const [,, board, threadNo, fragment] = threadRegex.exec(threadUrl)
    let res

    this._playlist.flash('Loading...')

    try {
      res = await axios.get(`/enqueue/${board}/thread/${threadNo}`)
    } catch (err) {
      this._playlist.flash('Failed to get thread data, are you sure it exists?')
      console.error(err)

      return
    }

    document.title = [
      `/${board}/`,
      res.data.subject,
      boards.getName(board),
      '4webm'
    ].join(' - ')
    const collect = collector(res.data.webms)

    this._webmUrls = collect('url')
    this._filenames = collect('filename')
    this._playlist.gen(
      this._filenames,
      collect('thumbnail'),
      res.data.subject,
      this.play.bind(this)
    )

    const index = fragment && Number(fragment) <= this._webmUrls.length
      ? Number(fragment) - 1
      : 0

    this.play(index)
  }

  registerRemote ({ toggle, next, prev, fullscreen, loop }) {
    const handler = (e) => {
      e.preventDefault()

      const key = keycode(e)

      if (key === toggle) {
        if (this._$video.paused === true) {
          this._$video.play()
        } else {
          this._$video.pause()
        }
      } else if (key === next) {
        this.next()
      } else if (key === prev) {
        this.prev()
      } else if (key === fullscreen) {
        if (this._$video.requestFullscreen) {
          this._$video.requestFullscreen()
        }
      } else if (key === loop) {
        this._toggleLoop()
      }
    }

    document.body.removeEventListener('keyup', handler)
    document.body.addEventListener('keyup', handler)
  }

  play (index) {
    if (index < this._webmUrls.length && index >= 0) {
      this._index = index
      this._play()
    }
  }

  next () {
    if (this._webmUrls.length - 1 > this._index) {
      this.play(this._index + 1)
    } else {
      this.play(0)
    }
  }

  prev () {
    if (this._index > 0) {
      this.play(this._index - 1)
    } else {
      this.play(this._webmUrls.length - 1)
    }
  }

  showThumbnails () {
    this._thumbnails = true
    this._playlist.showThumbnails()
  }

  hideThumbnails () {
    this._thumbnails = false
    this._playlist.hideThumbnails()
  }

  _toggleLoop () {
    this._$video.loop = !this._$video.loop
    this._$loop.checked = !this._$loop.checked
  }

  set loop (toggle) {
    this._$video.loop = toggle
    this._$loop.checked = toggle
  }

  _play () {
    this._$video.src = this._webmUrls[this._index]
    this._$status.innerHTML = `${this._index + 1} / ${this._webmUrls.length}`
    this._$title.innerHTML = `${this._filenames[this._index]}.webm`
    window.location.hash = this._index + 1
    this._playlist.update(this._index)
    this._$video.load()
  }
}

export default Player
