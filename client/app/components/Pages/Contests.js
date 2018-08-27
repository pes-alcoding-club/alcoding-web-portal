import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import ReactTable from "react-table";


class Contests extends React.Component {
  constructor() {
    super();
    this.state = {
      usn: "",
      name: "",
      contenderInfo: {},
      globalRankList: []
    };
  }


  componentDidMount() {
    var self = this;
    var token = localStorage.getItem('token')
    var userID = localStorage.getItem('user_id')

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
        console.log(data);
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
        <link rel="stylesheet" href="https://unpkg.com/react-table@latest/react-table.css"></link>
        <h3>Global Rank List</h3>
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
      </div>
    );
  }
}
export default Contests;
