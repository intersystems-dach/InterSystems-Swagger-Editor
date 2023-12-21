/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { Component } from "react"
import PropTypes from "prop-types"

import fileDialog from "file-dialog"
import YAML from "js-yaml"
import isJsonObject from "is-json"

export default class ImportFileMenuItem extends Component {

  input = ""

  onClick = async () => {
    const { onDocumentLoad } = this.props
    const fileList = await fileDialog()

    const fileReader = new FileReader()

    fileReader.onload = fileLoadedEvent => {
      let content = fileLoadedEvent.target.result
      console.log(content)
      try {
        const preparedContent = isJsonObject(content) ? YAML.dump(YAML.load(content)) : content

        if (typeof onDocumentLoad === "function") {
          onDocumentLoad(preparedContent)
        }
      } catch(e) {
        alert(`Oof! There was an error loading your document:\n\n${e.message || e}`)
      }
    }

    fileReader.readAsText(fileList.item(0), "UTF-8")
  }

  importFromInput = async () => {
    const { onDocumentLoad } = this.props
      try {
        const preparedContent = isJsonObject(this.input) ? YAML.dump(YAML.load(this.input)) : this.input

        if (typeof onDocumentLoad === "function") {
          onDocumentLoad(preparedContent)
        }
      } catch(e) {
        alert(`Oof! There was an error loading your document:\n\n${e.message || e}`)
      }

  }

  setInput = (input) => {
    this.input = input
  }

  render() {
    return <div>
      <li>
      <button type="button" onClick={this.onClick}>Import file</button>
    </li>
    <li>
      {
        // NOTICE: CHANGES
      }
      <textarea placeholder="Import from clipboard" onChange={event => {this.setInput( event.target.value)}}
      style={{ width: "100%", height: "50px"
    , borderBottom: "none"
    }}
      ></textarea>
    </li>
    <li>
      <button type="button" onClick={this.importFromInput}>Submit</button>
    </li>
      </div>
  }
}
ImportFileMenuItem.propTypes = {
  onDocumentLoad: PropTypes.func.isRequired,
}
