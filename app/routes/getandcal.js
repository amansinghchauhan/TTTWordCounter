//include request module to fetch the txt file from remote server
var request = require('request');
global.index = {};

module.exports = function(app){
  var txt;
  request.get('http://terriblytinytales.com/test.txt', function (err, res, body) {
    if (!err && res.statusCode == 200) {
      txt = body;
      index = {},
          pattern = txt
                      .replace(/\n/g, " ")
                      .replace(/\t/g, " ")
                      .replace(/\. /g, " ")
                      .replace(/[,?!;()"'-]/g, " ")
                      .replace(/\s+/g, " ")
                      .toLowerCase()
                      .split(" ");

      pattern.forEach(function (word) {
          if (!(index.hasOwnProperty(word))) {
              index[word] = 0;
          }
          index[word]++;
      });
    }
  });
  app.get('/check/:num', (req, res) => {
    var data;
    var list=[];
    const num = req.params.num;
    for (var key in index) {
      if (index.hasOwnProperty(key)) {
            data = {
            word: key,
            frequency: index[key]
        };
        list.push(data); // To add data in the array in a proper structure
        list.sort(GetSortOrder("frequency")); // Sort the array on the basis of Frequency
        list.reverse(); // To reverse the order of the array
      }
    }
    // Remove all but the first 'N' elements from the array
    list.splice(num, list.length);
    //Send the list to the frontend
    res.send(list);
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + 'index.html');
  });

  app.get('/check', (req, res) => {
    res.send("Please pass the number 'N' for the number of words.")
  });

  // Compare function to order the elements
  function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
  }
};
