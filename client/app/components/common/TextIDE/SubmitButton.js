import React,{Component} from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class SubmitCodeButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            showConfirmation: false,
        }
        this.submitCode = this.submitCode.bind(this);
        this.toggleConfirmation = this.toggleConfirmation.bind(this);
    }
   
    toggleConfirmation(){
        this.setState(prevState => ({
            showConfirmation: !prevState.showConfirmation
        }))
    }

    submitCode(event) {
        event.preventDefault()
        this.toggleConfirmation()

        const codeText = this.props.editor.getValue()        
        const codeLanguage = this.props.language.toLowerCase()

        var data = {
            content: codeText,
            language: codeLanguage,
            customInput: false,
            stdin: '',
            submit: true
        }

        if(this.props.customFunction === undefined){
            console.error('No Submit Function is defined for the TextIDE Component')
        }
        else {
            this.props.customFunction(data) 
        }
    }

    render(){
        return (

            <div>
                <Button className="btn btn-success" onClick= {this.toggleConfirmation} >
                    Submit
                </Button>

                <Modal isOpen={this.state.showConfirmation} toggle={this.toggleConfirmation}>
                    <ModalHeader toggle={this.toggleConfirmation}>Confirm to  Submit</ModalHeader>
                    <ModalBody>
                        Are you sure you want to submit?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitCode}>Submit</Button>
                        <Button color="secondary" onClick={this.toggleConfirmation}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

}

export default SubmitCodeButton;