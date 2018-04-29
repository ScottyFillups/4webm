'use strict'

class Playlist {
  constructor ($playlist) {
    this._$playlist = $playlist
    this._$imgs = []
  }

  gen (filenames, thumbnails, handler) {
    this._reset()

    filenames.forEach((filename, i) => {
      const $a = document.createElement('a')
      const $imgLink = document.createElement('a')
      const $img = document.createElement('img')
      const $div = document.createElement('div')
      const num = i + 1

      $a.innerHTML = `${num}. ${filename}.webm`
      $a.className = 'webm-link'
      $a.href = `#${num.toString()}`

      $a.addEventListener('click', () => handler(i))

      $img.src = thumbnails[i]
      $img.className = 'thumbnail'
      $img.addEventListener('click', () => handler(i))
      $imgLink.href = $a.href
      $imgLink.appendChild($img)

      $div.className = 'playlist-item'
      $div.appendChild($imgLink)
      $div.appendChild($a)

      this._$playlist.appendChild($div)
      this._$playlist.appendChild(document.createElement('br'))
    })
  }

  update (index, classname = 'active') {
    Array.from(this._$playlist.childNodes)
      .filter(x => x.tagName === 'DIV')
      .map(item => Array.from(item.childNodes))
      .map(itemComponents => itemComponents[1])
      .forEach((elem, i) => {
        if (index === i) {
          elem.classList.add(classname)
        } else {
          elem.classList.remove(classname)
        }
      })
  }

  flash (msg) {
    const $msg = document.createElement('p')
    $msg.innerHTML = msg

    this._reset()
    this._$playlist.appendChild($msg)
  }

  _reset () {
    while (this._$playlist.firstChild) {
      this._$playlist.removeChild(this._$playlist.firstChild)
    }
  }

  showThumbnails () {
    this._$imgs.forEach(($img) => {
      $img.classList.remove('hide')
    })
  }

  hideThumbnails () {
    this._$imgs.forEach(($img) => {
      $img.classList.add('hide')
    })
  }
}

export default Playlist
