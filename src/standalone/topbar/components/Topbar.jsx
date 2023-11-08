/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from "react"
import PropTypes from "prop-types"
import Swagger from "swagger-client"
import URL from "url"
import DropdownMenu from "./DropdownMenu"
import fileDownload from "js-file-download"
import YAML from "js-yaml"
import beautifyJson from "json-beautify"
import { petStoreOas2Def, petStoreOas3Def } from "../../../plugins/default-definitions"


import Logo from "../assets/logo_small.svg"
import { method } from "lodash"

export default class Topbar extends React.Component {

  // NOTICE: CHANGES

   host = "localhost"
   port = "52773"
   namespace = ""
   webapp = ""
   username = "_system"
   password = ""

  // NOTICE: CHANGES

   irisPostCall = async (title, body, url, header) => {
    await fetch(url, {
    method: "POST",
    body: body,
    headers: header,
    })
    .then((response) => response.json())
    .then((data) => {
      alert(data.msg)
    })
    .catch((err) => {
      alert(err.message)
    })
    }

  constructor(props, context) {
    super(props, context)

    this.state = {
      swaggerClient: null,
      clients: [],
      servers: [],
      definitionVersion: "Unknown"
    }
  }
  // NOTICE: CHANGES

  setIRISHost = (host) => {
    this.host = host
  }
  // NOTICE: CHANGES

  setIRISPort = (port) => {
    this.port = port
  }
  // NOTICE: CHANGES

  setIRISNamespace = (namespace) => {
    this.namespace = namespace
  }
  // NOTICE: CHANGES

  setIRISWebApp = (webapp) => {
    this.webapp = webapp
  }
  // NOTICE: CHANGES

  setIRISUsername = (username) => {
    this.username = username
  }
  // NOTICE: CHANGES

  setIRISPassword = (password) => {
    this.password = password
  }
  // NOTICE: CHANGES

  updateIRISSpec = () => {
    let json = this.getAsJson()
    console.log(json)
    let url = "http://" + this.host + ":" + this.port + "/api/mgmnt/v2/" + this.namespace + "/" + this.webapp
    let header = new Headers()
    header.append("Authorization", "Basic " + btoa(this.username+ ":" + this.password))
    header.append("Content-type", "application/json; charset=UTF-8")
    this.irisPostCall("", json, url, header)

  }

  getGeneratorUrl = () => {
    const { isOAS3, isSwagger2 } = this.props.specSelectors
    const { swagger2GeneratorUrl, oas3GeneratorUrl } = this.props.getConfigs()

    return isOAS3() ? oas3GeneratorUrl : (
      isSwagger2() ? swagger2GeneratorUrl : null
    )
  }

  instantiateGeneratorClient = () => {

    const generatorUrl = this.getGeneratorUrl()

    const isOAS3 = this.props.specSelectors.isOAS3()

    if(!generatorUrl) {
      return this.setState({
        clients: [],
        servers: []
      })
    }

    Swagger(generatorUrl, {
      requestInterceptor: (req) => {
        req.headers["Accept"] = "application/json"
        req.headers["Content-Type"] = "application/json"
      }
    })
    .then(client => {
      this.setState({
        swaggerClient: client
      })

      const clientGetter = isOAS3 ? client.apis.clients.clientLanguages : client.apis.clients.clientOptions
      const serverGetter = isOAS3 ? client.apis.servers.serverLanguages : client.apis.servers.serverOptions


      clientGetter({}, {
        // contextUrl is needed because swagger-client is curently
        // not building relative server URLs correctly
        contextUrl: generatorUrl
      })
      .then(res => {
        this.setState({ clients: res.body || [] })
      })

      serverGetter({}, {
        // contextUrl is needed because swagger-client is curently
        // not building relative server URLs correctly
        contextUrl: generatorUrl
      })
      .then(res => {
        this.setState({ servers: res.body || [] })
      })
    })
  }

  downloadFile = (content, fileName) => {
    if(window.Cypress) {
      // HACK: temporary workaround for https://github.com/cypress-io/cypress/issues/949
      // allows e2e tests to proceed without choking on file download native event
      return
    }
    return fileDownload(content, fileName)
  }

  // Menu actions

  importFromURL = () => {
    let url = prompt("Enter the URL to import from:")

    if(url) {
      fetch(url)
        .then(res => res.text())
        .then(text => {
          this.props.specActions.updateSpec(
            YAML.dump(YAML.load(text), {
              lineWidth: -1
            })
          )
        })
    }
  }

  saveAsYaml = () => {
    let editorContent = this.props.specSelectors.specStr()
    let language = this.getDefinitionLanguage()
    let fileName = this.getFileName()

    if(this.hasParserErrors()) {
      if(language === "yaml") {
        const shouldContinue = confirm("Swagger-Editor isn't able to parse your API definition. Are you sure you want to save the editor content as YAML?")
        if(!shouldContinue) return
      } else {
        return alert("Save as YAML is not currently possible because Swagger-Editor wasn't able to parse your API definition.")
      }
    }

    if(language === "yaml") {
      return this.downloadFile(editorContent, `${fileName}.yaml`)
    }

    // JSON String -> JS object
    let jsContent = YAML.load(editorContent)
    // JS object -> YAML string
    let yamlContent = YAML.dump(jsContent)
    this.downloadFile(yamlContent, `${fileName}.yaml`)
  }

  getAsJson = () => {
    let editorContent = this.props.specSelectors.specStr()

    if(this.hasParserErrors()) {
      // we can't recover from a parser error in save as JSON
      // because we are always parsing so we can beautify
      return alert("Save as JSON is not currently possible because Swagger-Editor wasn't able to parse your API definition.")
    }

    // JSON or YAML String -> JS object
    let jsContent = YAML.load(editorContent)
    // JS Object -> pretty JSON string
    let prettyJsonContent = beautifyJson(jsContent, null, 2)
    return prettyJsonContent
  }

  // NOTICE: CHANGES

  saveAsJson = () => {
    //this.downloadFile(prettyJsonContent, `${fileName}.json`)
    navigator.clipboard.writeText(this.getAsJson())
    alert("JSON copied to clipboard")
  }

  saveAsText = () => {
    // Download raw text content
    console.warn("DEPRECATED: saveAsText will be removed in the next minor version.")
    let editorContent = this.props.specSelectors.specStr()
    let isOAS3 = this.props.specSelectors.isOAS3()
    let fileName = isOAS3 ? "openapi.txt" : "swagger.txt"
    this.downloadFile(editorContent, fileName)
  }

  convertToYaml = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.load(editorContent)
    let yamlContent = YAML.dump(jsContent)
    this.props.specActions.updateSpec(yamlContent)
  }

  downloadGeneratedFile = (type, name) => {
    let { specSelectors } = this.props
    let swaggerClient = this.state.swaggerClient
    if(!swaggerClient) {
      // Swagger client isn't ready yet.
      return
    }

    if(specSelectors.isOAS3()) {
      // Generator 3 only has one generate endpoint for all types of things...
      // since we're using the tags interface we may as well use the client reference to it
      swaggerClient.apis.clients.generate({}, {
        requestBody: {
          spec: specSelectors.specJson(),
          type: type.toUpperCase(),
          lang: name
        },
        contextUrl: this.getGeneratorUrl()
      }).then(res => {
        this.downloadFile(res.data, `${name}-${type}-generated.zip`)
      })
    } else if(type === "server") {
      swaggerClient.apis.servers.generateServerForLanguage({
        framework : name,
        body: JSON.stringify({
          spec: specSelectors.specJson()
        }),
        headers: JSON.stringify({
          Accept: "application/json"
        })
      })
        .then(res => this.handleResponse(res, { type, name }))
    } else if(type === "client") {
      swaggerClient.apis.clients.generateClient({
        language : name,
        body: JSON.stringify({
          spec: specSelectors.specJson()
        })
      })
        .then(res => this.handleResponse(res, { type, name }))
    }
  }

  handleResponse = (res, { type, name }) => {
    if(!res.ok) {
      return console.error(res)
    }

    let downloadUrl = URL.parse(res.body.link)

    // HACK: workaround for Swagger.io Generator 2.0's lack of HTTPS downloads
    if(downloadUrl.hostname === "generator.swagger.io") {
      downloadUrl.protocol = "https:"
      delete downloadUrl.port
      delete downloadUrl.host
    }

    fetch(URL.format(downloadUrl))
      .then(res => res.blob())
      .then(res => {
        this.downloadFile(res, `${name}-${type}-generated.zip`)
      })
  }

  clearEditor = () => {
    if(window.localStorage) {
      window.localStorage.removeItem("swagger-editor-content")
      this.props.specActions.updateSpec("")
    }
  }

  loadPetStoreOas2 = () => {
    this.props.specActions.updateSpec(petStoreOas2Def)
  }

  loadPetStoreOas3 = () => {
    this.props.specActions.updateSpec(petStoreOas3Def)
  }

  // Helpers
  showModal = (name) => {
    this.setState({
      [name]: true
    })
  }

  hideModal = (name) => {
    this.setState({
      [name]: false
    })
  }

  // Logic helpers

  hasParserErrors = () => {
    return this.props.errSelectors.allErrors().filter(err => err.get("source") === "parser").size > 0
  }

  getFileName = () => {
    // Use `isSwagger2` here, because we want to default to `openapi` if we don't know.
    if(this.props.specSelectors.isSwagger2 && this.props.specSelectors.isSwagger2()) {
      return "swagger"
    }

    return "openapi"
  }



  getDefinitionLanguage = () => {
    let editorContent = this.props.specSelectors.specStr() || ""

    if(editorContent.trim()[0] === "{") {
      return "json"
    }

    return "yaml"
  }


  getDefinitionVersion = () => {
    const { isOAS3, isSwagger2 } = this.props.specSelectors

    return isOAS3() ? "OAS3" : (
      isSwagger2() ? "Swagger2" : "Unknown"
    )
  }

  ///// Lifecycle

  componentDidMount() {
    this.instantiateGeneratorClient()
  }

  componentDidUpdate() {
    const version = this.getDefinitionVersion()

    if(this.state.definitionVersion !== version) {
      // definition version has changed; need to reinstantiate
      // our Generator client
      // --
      // TODO: fix this if there's A Better Way
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        definitionVersion: version
      }, () => this.instantiateGeneratorClient())

    }
  }

  // NOTICE: CHANGES

  downloadAngularService = () =>{
    let json = JSON.parse(this.getAsJson())
    let title = json.info.title

    let text = `
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
`
  if(json.info.version){
    text += "\n// v" + json.info.version
  }
  if(json.info.description){
    text += "\n// " + json.info.description
  }
  text +=
`
export class ${title.replace(/\s/g,"")}Service {

  private host: string = 'localhost';
  private port: number = 52773;
  private webApp: string = '';

  constructor(private http: HttpClient) {}

`

    for( let pathName in json.paths){

      let methodComment = ""
      let methodHeader = ""
      let methodBody = ""

      let path = json.paths[pathName]
      let kind = Object.keys(path)[0]
      path = path[kind]

      methodComment =  "  /**\n  * " + path.description + "\n"

      methodBody = "    return this.http." + kind + "('http://' + this.host + ':' + this.port + '/' + this.webApp + '" + pathName + ""

      if(path.parameters){
        methodHeader = "  " + path.operationId + "(" + (path.parameters.map(p => p.name + ": " + (p.type == undefined? "any":p.type)).join(", ")) + ", body: any): Observable<any> {\n"
        methodComment += path.parameters.map(p =>(p.description== undefined?"": "  * @param " + p.name + ": " + p.description)).join("\n") + "\n"
        methodBody += "?" + path.parameters.map(p => p.name + "=' + " + p.name + " + '" ).join("&")
      } else {
        methodHeader = "  " + path.operationId + "(body: any): Observable<any> {\n"
      }
      methodComment += "  * @param body: The body of the request\n"

      let errorHandling = ""

      if(path.responses){
        methodComment += "  * @returns " + path.responses["200"].description + "\n"
        for(let responseCode in path.responses){
          if(responseCode == "200"){
            continue
          }
          errorHandling += "\n      if(err.status === " + responseCode + "){\n        throw new Error('" + path.responses[responseCode].description + "')\n      }"
          methodComment += "  * @throws " + responseCode + " " + path.responses[responseCode].description + "\n"
        }
      }
      methodComment += "  */\n"


      methodBody += "', body)\n    .pipe(catchError((err: HttpErrorResponse) => {"+errorHandling+"\n      if(err.status === 0){\n       throw new Error('Server is offline')\n      }\n      throw new Error('unknown error')\n    }));\n"
      text += methodComment + methodHeader + methodBody + "  }\n\n"
    }

    text += "\n}\n"

    console.log(json)
    console.log(text)
    this.downloadFile(text, title.replace(/\s/g,"-").toLowerCase()+".service.ts")
  }

  render() {
    let { getComponent, specSelectors, topbarActions } = this.props
    const Link = getComponent("Link")
    const TopbarInsert = getComponent("TopbarInsert")
    const ImportFileMenuItem = getComponent("ImportFileMenuItem")
    const ConvertDefinitionMenuItem = getComponent("ConvertDefinitionMenuItem")
    const AboutMenu = getComponent("TopbarAboutMenu", true)
    const { swagger2ConverterUrl } = this.props.getConfigs()

    let showServersMenu = this.state.servers && this.state.servers.length
    let showClientsMenu = this.state.clients && this.state.clients.length

    let definitionLanguage = this.getDefinitionLanguage()

    let isJson = definitionLanguage === "json"

    let makeMenuOptions = (name) => {
      let stateKey = `is${name}MenuOpen`
      let toggleFn = () => this.setState({ [stateKey]: !this.state[stateKey] })
      return {
        isOpen: !!this.state[stateKey],
        close: () => this.setState({ [stateKey]: false }),
        align: "left",
        toggle: <span className="menu-item" onClick={toggleFn}>{ name }</span>
      }
    }
    let makeMenuOptionsWithoutAutomaticClose = (name) => {
      let stateKey = `is${name}MenuOpen`
      let toggleFn = () => this.setState({ [stateKey]: !this.state[stateKey] })
      return {
        isOpen: !!this.state[stateKey],
        close: () => this.setState({ [stateKey]: false }),
        align: "left",
        closeOnInsideClick: false,
        toggle: <span className="menu-item" onClick={toggleFn}>{ name }</span>
      }
    }
  // NOTICE: CHANGES

    return (
      <div className="swagger-editor-standalone">
        <div className="topbar">
          <div className="topbar-wrapper">
            <Link href="https://swagger.io/tools/swagger-editor/">
              <img height="35" className="topbar-logo__img" src={ Logo } alt=""/>
            </Link>
            <DropdownMenu {...makeMenuOptionsWithoutAutomaticClose("File")}>
              <li><button type="button" onClick={this.importFromURL}>Import URL</button></li>
              <ImportFileMenuItem onDocumentLoad={content => this.props.specActions.updateSpec(content)} />
              <li role="separator"></li>
              {isJson ? [
                  <li key="1"><button type="button" onClick={this.saveAsJson}>Save as JSON</button></li>,
                  <><li key="2"><button type="button" onClick={this.saveAsYaml}>Convert and save as YAML</button></li><li key="3"></li></>
              ] : [
                  <li key="1"><button type="button" onClick={this.saveAsYaml}>Save as YAML</button></li>,
                  <><li key="2"><button type="button" onClick={this.saveAsJson}>Convert and copy as JSON</button></li><li key="3"></li></>
              ]}
              <li role="separator"></li>
              <li><button type="button" onClick={this.clearEditor}>Clear editor</button></li>
            </DropdownMenu>
            <DropdownMenu {...makeMenuOptions("Edit")}>
              <li><button type="button" onClick={this.convertToYaml}>Convert to YAML</button></li>
              <ConvertDefinitionMenuItem
                isSwagger2={specSelectors.isSwagger2()}
                swagger2ConverterUrl={swagger2ConverterUrl}
                onClick={() => topbarActions.showModal("convert")}
              />
              <li role="separator"></li>
              <li><button type="button" onClick={this.loadPetStoreOas3}>Load Petstore OAS 3.0</button></li>
              <li><button type="button" onClick={this.loadPetStoreOas2}>Load Petstore OAS 2.0</button></li>
            </DropdownMenu>
            <TopbarInsert {...this.props} />
            { showServersMenu ? <DropdownMenu className="long" {...makeMenuOptions("Generate Server")}>
              { this.state.servers
                  .map((serv, i) => <li key={i}><button type="button" onClick={() => this.downloadGeneratedFile("server", serv)}>{serv}</button></li>) }
            </DropdownMenu> : null }
            { showClientsMenu ? <DropdownMenu className="long" {...makeMenuOptions("Generate Client")}>
              { this.state.clients
                  .map((cli, i) => <li key={i}><button type="button" onClick={() => this.downloadGeneratedFile("client", cli)}>{cli}</button></li>) }
            </DropdownMenu> : null }
            {AboutMenu && <AboutMenu {...makeMenuOptions("About")} />}
            <DropdownMenu {...makeMenuOptionsWithoutAutomaticClose("IRIS")}>
                  <input defaultValue={this.host} type="text" placeholder="Host" style={{color: "black"}} onChange={event => {this.setIRISHost( event.target.value)}}></input>
                  <input defaultValue={this.port} type="text" placeholder="Port" style={{color: "black"}} onChange={event => {this.setIRISPort( event.target.value)}}></input>
                  <input defaultValue={this.namespace} type="text" placeholder="Namespace" style={{color: "black"}} onChange={event => {this.setIRISNamespace( event.target.value)}}></input>
                  <input defaultValue={this.webapp} type="text" placeholder="Webapp" style={{color: "black"}} onChange={event => {this.setIRISWebApp( event.target.value)}}></input>
                  <input defaultValue={this.username} type="text" placeholder="Username" style={{color: "black"}} onChange={event => {this.setIRISUsername( event.target.value)}}></input>
                  <input defaultValue={this.password} type="password" placeholder="Password" style={{color: "black"}} onChange={event => {this.setIRISPassword( event.target.value)}}></input>
                  <button type="button" style={{cursor: "pointer", background: "#00b6b0", border: "none", width: "100%", height: "30px"}} onClick={this.updateIRISSpec} >Update IRIS Specs</button>
            </DropdownMenu>
            <DropdownMenu {...makeMenuOptions("Export")}>
                  <button type="button" style={{cursor: "pointer", border: "none", width: "120px", height: "50px"}} onClick={this.downloadAngularService} >Export as Angular Service (BETA)</button>
            </DropdownMenu>
          </div>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  errSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  topbarActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired,
}