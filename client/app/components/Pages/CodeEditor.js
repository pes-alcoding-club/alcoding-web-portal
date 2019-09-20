import React, { Component } from 'react'
import TextIDE from "../common/TextIDE";
import sampleFunction from '../common/TextIDE/sampleFunction';

export default class CodeEditor extends Component {
    render() {
        return (
            <div >
                <TextIDE
                    width= "600px"
                    height= "600px"
                    languages = {['C','C++','Python 3','Java']}
                    defaultCode = {
                        {
                            'C++':'/* Enter your code here... */',
                            'Python 3':'# Enter your code here...',
                        }
                    }
                    // fontSize = '12pt'
                    // fontSizes = {['12pt','14pt','16pt']}
                    // theme = 'vs'
                    // readOnly = {true}
                    // showToolbar= {false}
                    // showCustomInput = {true}
                    // showRunButton = {true}
                    // showSubmitButton = {false}
                    runFunction = {sampleFunction}      //MANDATORY IF Run Button is shown..
                    submitFunction = {sampleFunction}   //MANDATORY IF Submit Button is shown..
                />
            </div>
            
        )
    }
}

/*
DEFAULT VALUES FOR <TextIDE></TextIDE>
    width= "700px"
    height= "600px"
    languages = ['C','C++','Python 2','Python 3','Java']
    defaultCode = '' for all languages defined above
    fontSize = '12pt'
    fontSizes = {['12pt','14pt','16pt']}
    theme = 'vs'
    readOnly = {false}
    showToolbar= {true}
    showCustomInput = {true}
    showRunButton = {true}
    showSubmitButton = {true}
    runFunction = NO DEFAULTS    
    submitFunction = NO DEFAULTS 
*/