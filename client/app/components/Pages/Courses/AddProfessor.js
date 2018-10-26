import React, { Component } from 'react';


class AddProfessor extends React.Component {
    constructor(props) {
      super(props);
      this.state = { values: [] };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addClick = this.addClick.bind(this);
    }
  
    createUI(){
       return this.state.values.map((el, i) => 
           <div key={i}>
                <div className="form form-inline">
                        <input type="text" className="form-control mx-2" placeholder="Professor of Class" value={this.state.professorID} onChange={this.handleProfessorChange} />
                        <input type="text" className="form-control mx-2" placeholder="Enter Sections with a comma in between" value={this.state.sections} onChange={this.handleSectionChange} />
                    </div>
               {/* <input type="text" value={el||''} onChange={this.handleChange.bind(this, i)} /> */}
               {/* <input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/> */}
           </div>          
       )
    }
  
    handleChange(i, event) {
       let values = [...this.state.values];
       values[i] = event.target.value;
       this.setState({ values });
    }
    
    addClick(){
      this.setState(prevState => ({ values: [...prevState.values, '']}))
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.values.join(', '));
      event.preventDefault();
    }
  
    render() {
      return (
        <form>
            {this.createUI()}        
            <input className="btn btn-dark mx-2" value="Add new" onClick={this.addClick}/>
            <button type="submit" className = "btn btn-dark mx-2" onClick={this.handleSubmit}>Confirm </button>
        </form>
      );
      }
    }  

export default AddProfessor;