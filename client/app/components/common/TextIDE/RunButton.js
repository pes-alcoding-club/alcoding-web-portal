import React,{Component} from 'react';
import {Button} from 'reactstrap';


class RunCodeButton extends Component {

    constructor(props){
        super(props);
        
        this.submitCode = this.submitCode.bind(this);
    }

    submitCode(event) {
        event.preventDefault()

        const codeText = this.props.editor.getValue()        
        const codeLanguage = this.props.language.toLowerCase()
        const isCustomInput = this.props.isCustomInput
        var stdin = ''
        
        if(isCustomInput){
            stdin = document.getElementById('customInput').value
        }

        var data = {
            content: codeText,
            language: codeLanguage,
            customInput: isCustomInput,
            stdin: stdin,
            submit: false
        }
        if(this.props.customFunction === undefined){
            console.error('No Run Function is defined for the TextIDE Component')
        }
        else {
            this.props.customFunction(data) 
        }
    }

    render(){
        return (
            <div>
                <Button className="btn btn-outline-primary" onClick= {this.submitCode} style={{color:'white'}}>
                    Run Code
                </Button>
            </div>
        )
    }

}

export default RunCodeButton;