 'use strict';
 const fs = require('fs').promises;
 const path = require('path');
 const filePath = path.join(__dirname, 'data.json');
  module.exports.fetchData = async (event, context) => {
  return new Promise(resolve => {
    fs.readFile(filePath, 'utf8')
      .then(data => {
        const jsonData = JSON.parse(data);
        const filteredData = formatData(jsonData, event.queryStringParameters);
        resolve({
          body: filteredData,
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      })
      .catch(err => {
        resolve({
          body: JSON.stringify(err),
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });
    });
};

const formatData = (data, query) => {
    if(query) {
      const filteredData = data.filter(item=> {
        for (let key in query) {
          if(item[key] === undefined || item[key] === null) {
            return false;
          } else {
            if(['primary_city','acceptable_cities','unacceptable_cities' , 'zip','latitude', 'longitude'].includes(key)) {
              return checkPartialMatch(item,key,query);
            } else {
              if (item[key] != query[key]) {
                return false;
              } else {
                return true;
              }           
            }   
          }
        }        
      });
      return JSON.stringify(filteredData);
    } else {
      return JSON.stringify(data);
    }
}

  const checkPartialMatch = (item, key, query) => {
    switch(key) {
      case 'zip':
      case 'primary_city':
      case 'acceptable_cities':
      case 'unacceptable_cities':
        if((item[key].toLowerCase()).includes((query[key].toLowerCase()))) {
          return true;
        } else {
          return false;
        }
      case 'longitude':
      case 'latitude':
        if(Math.abs(Math.ceil(parseFloat(item[key])- parseFloat(query[key]))) <= 1) {
          return true
        } else {
          return false;
        }
    }
  }



