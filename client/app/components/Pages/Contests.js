import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import ReactTable from "react-table";
import Iframe from 'react-iframe';


class Contests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

    var apiPath = '/api/contests/'+ userID +'/contenderInfo';
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
        console.log('Error: ', error);
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
        data.sort(function(a, b){
          return b.rating-a.rating;
        });
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
            return <div>{row.index+1}</div>;
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

    return (
      <div>
          <div className="container">
                <div className="jumbotron pt-3 pb-2 bg-light">
                    <div className="container">
                        <div className='display-4 mb-3'>Contender Details</div>
                        <p>Your rating shall be updated after every rated contest. If you have not taken part in any contests, you will see a '-1' indicating the same.</p>
                        Name: {this.state.name.firstName} {this.state.name.lastName}<br />
                        <hr />
                        Rating: {Math.round(this.state.contender.rating)}&nbsp;&nbsp;&nbsp;
                        <strong>Best: {Math.round(this.state.contender.best)}&nbsp;&nbsp;&nbsp;</strong>
                        Contests: {this.state.contender.timesPlayed}&nbsp;&nbsp;&nbsp;
                        <br />
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
                        <Iframe url="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=7tldkuuq0qmf9onobqoprgfup4%40group.calendar.google.com&amp;color=%238D6F47&amp;ctz=Asia%2FCalcutta"
                            width="1000px"
                            height="600px"
                            position="relative"/>
                    </div>
                </div>
            </div>
        <link rel="stylesheet" href="https://unpkg.com/react-table@latest/react-table.css"></link>
      </div>
    );
  }
}
export default Contests;
