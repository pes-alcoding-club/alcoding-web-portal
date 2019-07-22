import React,{Component} from "react";
import { FaCaretDown, FaCog, FaUndoAlt } from "react-icons/fa";
import { Button, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



const toolBarStyle = {
    height: '40px',
    background:'#DCDCDC',
    marginBottom: '0px',
    boxShadow: '0px 3px 5px black'
}

const dropdownStyle = {
    width: '120px',
    height:'30px',
    background: '#DCDCDC',
    color: 'black',
    margin: '5px',
    boxShadow: 'none'
}

const dropdownButtonStyle = {
    border: '1px black solid',
    height:'28px',
    width: '120px',
    padding: '0px'
}

const editorSettingsStyle = {
    maxWidth: '500px',
    background: '#F5F5F5',
    borderRadius: '5px',
    paddingLeft: '2px',
    paddingRight: '2px',
    marginTop: '10px'
}

const editorSettingsRowStyle = {
    padding: '10px 0 10px 0',
}

const settingButton = {
    margin: '2px',
    borderRadius: '2px',
    width:'100px',
    fontSize:'10pt',
}

const labelStyle = {
    margin:'auto 10px auto 10px',
    width:'100px',
    fontSize: '12pt',
    fontFamily: 'Monospace, Courier New'
}

const dropdownBoxStyle = {
    minWidth:'120px',
    maxWidth: '140px',
    maxHeight:'150px',
    overflowY: 'auto',
}

class Toolbar extends Component{

    constructor(props){
        super(props);
        this.state = {
            chosenLanguage: this.props.editorLanguage,
            chosenLanguageShow: this.props.editorLanguageKey,
            languages: this.props.languages,
            themes: this.props.themes,
            fontSizes: this.props.fontSizes
        }
        this.changeEditorLanguage = this.changeEditorLanguage.bind(this)
        this.changeEditorBackground = this.changeEditorBackground.bind(this)
        this.changeEditorFontSize = this.changeEditorFontSize.bind(this)
        this.resetCode = this.resetCode.bind(this)
        
    }

    changeEditorBackground(event) {
        event.preventDefault();
        this.props.changeEditorBackground(event,event.target.id);
    }

    changeEditorLanguage(event) {
        event.preventDefault();
        this.props.changeEditorLanguage(event,event.target.id,event.target.value);
        this.setState({
            chosenLanguage: event.target.id,
            chosenLanguageShow: event.target.value
        });
    }

    changeEditorFontSize(event) {
        event.preventDefault();
        this.props.changeEditorFontSize(event,event.target.id);
    }

    //Reset Code to defualt value
    resetCode() {
        this.props.resetCode()
    }

    
    render(){
        const lang_items = []
        for(const lang in this.state.languages){
            var lang_button = <DropdownItem id={this.state.languages[lang]} key={lang} value={lang} onClick={this.changeEditorLanguage}>
                                {lang}
                              </DropdownItem>
            lang_items.push(lang_button);
        }

        const theme_items = []
        for (const theme_name in this.state.themes) {
            const btnclass = this.props.editorTheme === this.state.themes[theme_name]?'btn btn-sm btn-success':'btn btn-sm'
            var theme_button = <div key={this.state.themes[theme_name]} >
                                    <Button className={btnclass} style={settingButton} id={this.state.themes[theme_name]} key={this.state.themes[theme_name]} onClick={this.changeEditorBackground}> 
                                        {theme_name} 
                                    </Button>
                                </div>
            theme_items.push(theme_button)
        }

        const font_items = []
        for (const font_size in this.state.fontSizes) {
            const btnclass = this.props.editorFontSize === this.state.fontSizes[font_size]?'btn btn-sm btn-success':'btn btn-sm'
            var font_button =   <div key={this.state.fontSizes[font_size]} >
                                    <Button className={btnclass} style={settingButton} id={this.state.fontSizes[font_size]} key={this.state.fontSizes[font_size]} onClick={this.changeEditorFontSize}> 
                                        {this.state.fontSizes[font_size]} 
                                    </Button>
                                </div>
            font_items.push(font_button)
        }

        return(
            
            <div style={toolBarStyle}>
                <div className = "float-left">
                </div>

                <div className = "d-flex float-right">
                    <div className="float-left">
                        <UncontrolledDropdown size="sm" style={dropdownStyle} title="Change Language">
                            <DropdownToggle caret color="#000" style={dropdownButtonStyle}>
                                <span className="float-left" style={{textAlign:'left',width:'90px',paddingLeft:'5px'}}>{this.state.chosenLanguageShow}</span>
                            </DropdownToggle>
                            <DropdownMenu style={dropdownBoxStyle}>
                                {lang_items}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                    <div className="float-right" style={{margin:'auto'}}>    
                        <div className="float-left" style={{height:'100%'}}>
                            <span style={{padding:'5px 0px 5px 5px'}} id="reset-code" title="Reset Code" >
                                <FaUndoAlt size='25' style={{padding:'5px'}} title="Reset Code" onClick={this.resetCode} ></FaUndoAlt>
                            </span> 
                        </div>
                        <div className="float-right"> 
                            <UncontrolledDropdown id="language-dropdown" title="Editor Settings">
                                <DropdownToggle tag = "span">
                                    <span style={{padding:'5px 5px 5px 0px'}} id="language-dropdown" title="Change Language">
                                        <FaCog size='25' style={{padding:'5px'}} title="Editor Settings"></FaCog>
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu right style={editorSettingsStyle}>
                                    <div className="input-group"  style={editorSettingsRowStyle}>
                                        <div className="d-none d-sm-block">
                                            <div className="input-group-append">
                                                <label className="align-middle" style={labelStyle}>Editor Mode</label>
                                                <div className="d-none d-sm-block">
                                                    <ButtonGroup size="sm">
                                                        {theme_items}
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                            <div className="input-group-append">
                                                <label className="align-middle" style={labelStyle}>Font Size</label>
                                                <div className="d-none d-sm-block">
                                                    <ButtonGroup size="sm">
                                                        {font_items}
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-block d-sm-none">
                                            <div>
                                                <label className="align-middle" style={labelStyle}>Editor Mode</label>
                                                <div className="d-block d-sm-none" style={{paddingLeft:'15px'}}>
                                                    <ButtonGroup vertical size="sm">
                                                        {theme_items}
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="align-middle" style={labelStyle}>Font Size</label>
                                                <div className="d-block d-sm-none" style={{paddingLeft:'15px'}}>
                                                    <ButtonGroup vertical size="sm">
                                                        {font_items}
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                   
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>
                </div>

            </div>            
        )
    }
}

export default Toolbar