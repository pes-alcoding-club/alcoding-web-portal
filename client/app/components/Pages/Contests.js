import React, { Component } from 'react';
import axios from 'axios';
import ReactLoading from '../common/Loading';
import ReactTable from "react-table";
import 'react-table/react-table.css';

class Contests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      usn: "",
      name: {},
      contender: {},
      globalRankList: []
    };
  }


  componentDidMount() {
    var self = this;
    var token = localStorage.getItem('token');
    var userID = localStorage.getItem('user_id');

    var apiPath = '/api/contests/' + userID + '/contenderInfo';
    axios.get(apiPath, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        if (!response.data.success) {
          console.log("Error: " + response.data);
          return;
        }
        var data = response.data.contenderDetails;
        self.setState({
          name: data.name,
          contender: data.contender
        });

      })
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          if (error.response.status) {
            alert("Session timed out.");
            window.location.href = '/';
          }
        }
      });

    var apiPath = '/api/contests/globalRankList';
    axios.get(apiPath, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        if (!response.data.success) {
          console.log("Error: " + response.data);
          return;
        }
        var data = response.data.globalRankList.userContenderDetails;
        data.sort(function (a, b) {
          return b.rating - a.rating;
        });
        self.setState({ isLoading: false });
        self.setState({
          globalRankList: data
        });

      })
      .catch(function (error) {
        console.log('Error: ', error);
      });
  }

  render() {

    const data = this.state.globalRankList;

    const columns =
      [
        {
          Header: "Rank",
          id: "row",
          maxWidth: 65,
          filterable: false,
          Cell: (row) => {
            return <div>{row.index + 1}</div>;
          }
        },
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "USN",
          accessor: "usn",
          maxWidth: 200,
        },
        {
          Header: "Contests",
          accessor: "timesPlayed",
          maxWidth: 100,
        },
        {
          Header: "Rating",
          accessor: "rating",
          maxWidth: 150,
        },
        {
          Header: "Best",
          accessor: "best",
          maxWidth: 150,
        }
      ]
    if (this.state.isLoading)
      return <ReactLoading/>;
    else
      return (
          <div className="jumbotron pt-3 pb-4 bg-light">
            <div className='display-4 mb-3'>Contender Details</div>
            <p className="lead">Your rating shall be updated after every rated contest. If you have not taken part in any contests, you will see a '-1' indicating the same. For more information about the parameters for this Global Ranking, please visit the link <a href="https://github.com/varunvora/alcoding">here.</a></p>
            <p>Name: {this.state.name.firstName} {this.state.name.lastName}</p>
            <p>
              Rating: {Math.round(this.state.contender.rating)}&nbsp;&nbsp;&nbsp;
                        <strong>Best: {Math.round(this.state.contender.best)}&nbsp;&nbsp;&nbsp;</strong>
              Contests: {this.state.contender.timesPlayed}&nbsp;&nbsp;&nbsp;
                </p>
            <hr />
            <div className='display-4 mb-3'>Global Rank List</div>
            <br />
            <ReactTable
              data={data}
              columns={columns}
              defaultSorted={[
                {
                  id: "rating",
                  desc: true
                }
              ]}
              defaultPageSize={10}
              index=""
              viewIndex=""
              className="-striped -highlight"
            />
            <br />
            <div className='display-4 mb-3'>Calender</div>
            <p>This calender is curated by Varun Vora. To add this calender to your Google calender, click on the Google icon on the bottom right corner.</p>
            <div className="embed-responsive embed-responsive-16by9" >
              <iframe className="embed-responsive-item" src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showCalendars=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=7tldkuuq0qmf9onobqoprgfup4%40group.calendar.google.com&amp;color=%234E5D6C&amp;ctz=Asia%2FCalcutta" scrolling="no"></iframe>
            </div>
          </div>
      );
  }
}
export default Contests;
