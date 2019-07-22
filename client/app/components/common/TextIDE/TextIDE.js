import React from 'react';
import Toolbar from './Toolbar';
import RunCodeButton from './RunButton';
import SubmitCodeButton from './SubmitButton';
import MonacoEditor from 'react-monaco-editor';
import { InputGroup, InputGroupText, Input } from 'reactstrap';



const buttonRowStyle ={
    marginBottom: '5px',
    marginTop :'5px'

}

const bottomRowStyle ={
    overflow: 'auto',
    marginTop: '15px',
    marginBottom: '5px',
    padding: '0px',
}

const editorStyle ={
    padding:'0px',
    boxShadow: '0px 3px 5px black'
}

// Add(in the same format) or remove languages

const languages = {
    'C'        : 'c',
    'C++'      : 'cpp',
    'Python 2' : 'python',
    'Python 3' : 'python',
    'Java'     : 'java'
}   

//No other themes available
const themes = {
    'Light'             : 'vs',
    'Dark'              : 'vs-dark',
    'High Contrast'     : 'hc-black'
}

// Add(in the same format) or remove fontSizes 
// First fontSize is the default fontSize
const fontSizes = ['12pt','14pt','16pt']

class TextIDE extends React.Component{

    constructor(props){
        super(props);
        this.customLanguages = this.props.languages===undefined? Object.keys(languages):this.props.languages
        this.languages = Object()

        for (const i in this.customLanguages) {
            if (this.customLanguages[i] in languages){
                this.languages[this.customLanguages[i]] = languages[this.customLanguages[i]]
            }
            else{
                var lang_name = this.customLanguages[i].charAt(0).toUpperCase() + this.customLanguages[i].toLowerCase().slice(1)
                var lang_name_lowercase = this.customLanguages[i].toLowerCase()
                this.languages[lang_name] = lang_name_lowercase
            }
        }
        
        this.defaultWidth = '700px'
        this.defaultHeight = '600px'
        if(this.props.width===undefined){
            this.width = this.defaultWidth
        }else{
            if(this.props.width.indexOf('px')>-1)
                this.width = this.props.width
            else
                this.width = parseInt(this.props.width)+'px'
        }
        if(this.props.height===undefined){
            this.height = this.defaultHeight
        }else{
            if(this.props.height.indexOf('px')>-1)
                this.height = this.props.height
            else
                this.height = parseInt(this.props.height)+'px'
        }

        this.defaultCode = Object()
        for (const lang in this.props.defaultCode){
            var lang_name = lang.charAt(0).toUpperCase() + lang.toLowerCase().slice(1)
            this.defaultCode[lang_name] = this.props.defaultCode[lang]
        }

        for(const lang in this.languages){
            if (!(lang in this.defaultCode)){
                this.defaultCode[lang] = ''
            }
        }

        this.fontSize = this.props.fontSize===undefined? fontSizes[0]:this.props.fontSize
        this.fontSizes = this.props.fontSizes===undefined? fontSizes:this.props.fontSizes
        this.theme = this.props.theme===undefined? Object.values(themes)[0]:this.props.theme

        this.readOnly = this.props.readOnly===undefined? false:this.props.readOnly
        //this.showButtons = this.props.showButtons===undefined ? (!this.readOnly):(this.props.showButtons && !this.readOnly)
        this.showRunButton =  this.props.showRunButton===undefined ? (!this.readOnly): (this.props.showRunButton && !this.readOnly)
        this.showSubmitButton = this.props.showSubmitButton===undefined ? (!this.readOnly): (this.props.showSubmitButton && !this.readOnly)

        this.state = {
            width: this.width,
            height: this.height,
            editorTheme: this.theme,
            editorLanguage: Object.values(this.languages)[0],
            editorLanguageKey: Object.keys(this.languages)[0],
            editorFontSize: this.fontSize,
            editorText: this.defaultCode[Object.keys(this.languages)[0]],
            languages: this.languages,
            themes: themes,
            fontSizes: this.fontSizes,
            customInput: false,
            readOnly: this.readOnly,
            showToolbar: this.props.showToolbar===undefined ? (!this.readOnly):(this.props.showToolbar && !this.readOnly),
            //showButtons: this.showButtons,
            showRunButton: this.showRunButton,
            showSubmitButton: this.showSubmitButton,
            showCustomInputOption: this.props.showCustomInput===undefined ? (!this.readOnly && (this.showRunButton || this.showSubmitButton)): 
                                    (this.props.showCustomInput && !this.readOnly && (this.showRunButton || this.showSubmitButton)), 
            
        }

        this.changeEditorBackground = this.changeEditorBackground.bind(this)
        this.changeEditorLanguage = this.changeEditorLanguage.bind(this)
        this.changeEditorFontSize = this.changeEditorFontSize.bind(this)
        this.editorDidMount = this.editorDidMount.bind(this)
        this.showCustomInput = this.showCustomInput.bind(this)
        this.resetCode = this.resetCode.bind(this)

    }

    changeEditorBackground(event,theme){
        this.setState({
            editorTheme: theme
        })
    }

    changeEditorLanguage(event,language,languageKey){
        this.setState({
            editorLanguage: language,
            editorLanguageKey: languageKey,
            editorText: this.defaultCode[languageKey]
        })
        this.state.editor.getModel().setValue(this.defaultCode[languageKey])
    }

    changeEditorFontSize(event,fontsize){
        this.setState({
            editorFontSize: fontsize
        })
    }

    showCustomInput(event){
        this.setState( prevState => ({
            customInput: !prevState.customInput
        }))
    }

    editorDidMount(editor) {
        this.setState({
          editor: editor
        });
        editor.focus()
    }

    //Reset Code to defualt value
    resetCode() {
        this.state.editor.getModel().setValue(this.defaultCode[this.state.editorLanguageKey])   
        this.state.editor.focus()
    }

    componentDidMount() {
        //Check if runFunction and submitFunction have been defined as the props..
        if(!this.readOnly){
            if(this.showRunButton && this.props.runFunction === undefined){
                console.warn('Run Function is not defined for the TextIDE\nPass a function as a prop(runFunction) to the TextIDE component')
            }
            if(this.showSubmitButton && this.props.submitFunction === undefined){
                console.warn('Submit Function is not defined for the TextIDE\nPass a function as a prop(submitFunction) to the TextIDE component')
            }
        }
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    //Auto-resizing of the editor
    updateDimensions() {
        this.state.editor.layout();
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }
    
    render() {

        const containerStyle = {
            padding: '15px 15px 2px 15px',
            maxWidth: this.state.width
        }

        const editorOptions= {
            fontSize: this.state.editorFontSize,
            value: this.state.editorText,
            readOnly: this.state.readOnly,
            snippetSuggestions: true,
            autoClosingBrackets: true,
            autoClosingQuotes: true,
            quickSuggestions: true,
            copyWithSyntaxHighlighting: true,
            formatOnPaste: true,
            autoIndent: true,
        }


        return(
            <div style={containerStyle} className="col-sm-12 col-md-10 col-xl-8">
            
                {(this.state.showToolbar) && (
                    <div id="toolbar"  style={{padding:'0px'}}>
                        <Toolbar 
                            changeEditorBackground = {this.changeEditorBackground} 
                            changeEditorLanguage = {this.changeEditorLanguage} 
                            changeEditorFontSize = {this.changeEditorFontSize} 
                            resetCode = {this.resetCode}
                            editorLanguage = {this.state.editorLanguage}
                            editorLanguageKey = {this.state.editorLanguageKey}
                            editorTheme = {this.state.editorTheme}
                            editorFontSize = {this.state.editorFontSize}
                            languages = {this.state.languages}
                            themes = {this.state.themes}
                            fontSizes = {this.state.fontSizes}
                            // width = {this.state.width}
                        />
                    </div>
                )}

                <div id="editor" style= {editorStyle} >
                    <MonacoEditor 
                        id= "monacoEditor"
                        // width = {this.state.width}
                        height = {this.state.height}
                        language = {this.state.editorLanguage}
                        theme = {this.state.editorTheme}
                        options= {editorOptions} 
                        editorDidMount= {this.editorDidMount}
                    />
                </div>
       
                {(
                    <div style={bottomRowStyle}  >
                        {(this.state.showCustomInputOption) && (
                            <div className="float-left" style={buttonRowStyle}>
                                <InputGroup>
                                    <InputGroupText>
                                        <Input addon type="checkbox" aria-label="Checkbox for following text input" onClick= {this.showCustomInput} />
                                        &nbsp;&nbsp;Test against custom input
                                    </InputGroupText>
                                </InputGroup>
                                {(this.state.customInput) && (
                                    <div>
                                        <br/>
                                        <Input type="textarea" id="customInput" rows='7' style={{width:'300px',marginBottom:'5px'}}>
                                        </Input>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="float-right" style={buttonRowStyle}>
                            {(this.state.showRunButton) && (
                                <div className="float-left" style={{margin:'2px'}}>
                                        <RunCodeButton editor={this.state.editor} isCustomInput={this.state.customInput} language={this.state.editorLanguageKey}  customFunction={this.props.runFunction} />
                                </div>
                            )}
                            {(this.state.showSubmitButton) && (
                                <div className="float-right" style={{margin:'2px'}}>
                                        <SubmitCodeButton editor={this.state.editor} language={this.state.editorLanguageKey} customFunction={this.props.submitFunction} />
                                </div>
                            )}
                        </div>
                    </div> 
                )}

            </div>
        );
    }
}

export default TextIDE;