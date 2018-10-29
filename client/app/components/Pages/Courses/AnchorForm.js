import React from "react";
import axios from 'axios';

class AnchorForm extends React.Component {
    constructor() {
        super();
        this.state = {
            values: [{ profID: "", sections: "" }],
        }
        this.handleChange = this.handleChange.bind(this);
        this.addProf = this.addProf.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {

    }
    handleChange(e) {
        e.preventDefault();
        if (["profID", "sections"].includes(e.target.className)) {
            let values = [...this.state.values]
            values[e.target.dataset.id][e.target.className] = e.target.value
            this.setState({ values });
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }
    addProf(e) {
        e.preventDefault();
        this.setState((prevState) => ({
            values: [...prevState.values, { profID: "", sections: "" }],
        }));
    }
    // handleSubmit = async function(e) {
    handleSubmit(e) {
        e.preventDefault()
        this.sendToDb();
    }

    async sendToDb()
    {
        console.log(this.state.values);
        var self = this;
        var userID = localStorage.getItem('user_id');
        var token = localStorage.getItem('token');
        var apiPath = 'api/assignments/createCourse';
        var config = {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        }
        var data = Object.assign({}, self.state.course);

        data.name = self.props.name;
        data.code = self.props.code;
        data.department = self.props.department;
        data.description = self.props.description;
        data.resourcesUrl = self.props.resourcesUrl;
        var details = { credits: self.props.credits, hours: self.props.hours, isCore: self.props.isCore }
        data.details = details;
        var duration = { startDate: self.props.startDate, endDate: self.props.endDate }
        data.duration = duration;
        data.graduating = self.props.graduating;
        var values = self.state.values;
        var err_flag = false;
        // self.state.classes is an array of objects
        // Each object has 2 items - ProfessorID and Array of sections just like in Model
        // [{professorID: value , sections:[.....]},{professorID:value, sections:[.....]}]
        values.forEach(function(classData) {
            var body = Object.assign({}, data);
            body.professorID = classData.profID;
            body.sections = classData.sections;
            body.anchorDescription = self.props.anchorDescription;
            body.role = "anchor";
            console.log(body);
            console.log(classData.profID);
            console.log(classData.sections);
            axios.post(apiPath, body, config)
                .then(res => {
                    console.log(res.data);
                    window.location.reload();
                })
                .catch(err => {
                    console.log(err);
                    err_flag = true
                })  
        });
        if(err_flag) alert("Course failed to upload");
    }
    render() {
        let { values } = this.state
        return (
            <form className="form-group ml-1 text-left">
                <hr />
                <div className="row mb-0">
                    <h6 className="col-6">Professor IDs</h6>
                    <h6 className="col-6">Sections</h6>
                </div>
                {
                    values.map((val, idx) => {
                        let pId = `p-${idx}`, cId = `c-${idx}`
                        return (
                            <div className="row ml-0 form form-inline" key={idx}>
                                {/* <label htmlFor={pId}>{`Professor #${idx + 1}`}</label> */}
                                <input
                                    type="text"
                                    name={pId}
                                    data-id={idx}
                                    id={pId}
                                    onChange={this.handleChange}
                                    value={values[idx].profID}
                                    placeholder="Professor USN"
                                    // className="profID mr-1 mb-1 form-control"
                                    className="profID"
                                />
                                {/* <label htmlFor={cId}>Sections</label> */}
                                <input
                                    type="text"
                                    name={cId}
                                    data-id={idx}
                                    id={cId}
                                    onChange={this.handleChange}
                                    value={values[idx].sections}
                                    placeholder="Add sections with comma in between"
                                    className="sections"
                                />
                            </div>
                        )
                    })
                }
                <button className="btn btn-dark btn-sm mt-2 mb-2 mr-3" onClick={this.addProf}>Add new professor</button>
                <hr />
                <button type="submit" className="btn btn-dark mt-1 mb-2" onClick={this.handleSubmit} value="Submit" >Submit</button>

            </form>
        )
    }
}
export default AnchorForm;