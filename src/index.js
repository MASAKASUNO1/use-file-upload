import React, { useState } from 'react'
// import styles from './styles.module.css'

function createInputComponent({ multiple, accept }) {
  const el = document.createElement('input')
  // set input config
  el.type = 'file'
  el.capture = 'camera'
  el.accept = accept
  el.multiple = multiple
  // return file input element
  return el
}

export const useFileUpload = () => {
  const [files, setFiles] = useState(null)
  let userCallback = () => {}

  // Handle onChange event
  const onChange = async (e) => {
    const parsedFiles = []
    const target = e.target
    console.log("---onChange----")
    // Loop through files
    for (const fileIndex in target.files) {
      // check if index is a number
      if (isNaN(fileIndex)) {
        console.log("---fileIndex----")
        continue
      }

      // get file object
      const file = target.files[fileIndex]
      console.log("---file----", file)

      // select properties

      const parsedFile = {
        source: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        file // original file object
      }
      console.log("---parsedFile----", parsedFile)

      // add to parsed file list
      parsedFiles.push(parsedFile)
    }

    // remove event listener after operation
    target.removeEventListener('change', onChange)

    // remove input element after operation
    target.remove()

    // update files state hook

    if (target.multiple) {
      setFiles(parsedFiles)
      return userCallback(parsedFiles)
    }

    setFiles(parsedFiles[0])
    return userCallback(parsedFiles[0])

    // user specified callback
  }

  // Handle upload
  const uploadFile = (
    { accept, multiple } = { accept: '', multiple: false },
    cb
  ) => {
    if (typeof cb === 'function') {
      userCallback = cb
    }
    console.log("+++++")
    // create virtual input element
    const inputEL = createInputComponent({ multiple, accept })
    console.log("+++inputEL+++", inputEL)
    // add event listener
    inputEL.addEventListener('change', onChange)
    inputEL.click()
  }
  console.log("+++end+++", inputEL)

  return React.useMemo(() => [files, uploadFile], [files])
}
