
var request = require('request');
var assert = require('chai').assert;

var baseUrl = "http://localhost:3000";

function dumpReq(req) {
  var output = '';

  var host = `${req.host}`['green'];
  var port = `${req.port}`['green']
  var method = `${req.method}`['green'];
  var path = `${req.path}`['white'].bold;
  var protocol = 'HTTP/1.1'['gray'];

  var lines = [
    `${method} ${path} ${protocol}`,
  ];

  for (var i in lines) {
    output += lines[i]+"\n";
  }

  return output;
}

function dumpRes(res) {
  var output = '';

  output += res.statusCode+" "+res.statusMessage+"\n\n";
  output += JSON.stringify(JSON.parse(res.body), null, 2);

  return output;
}

module.exports = function(grunt) {
  grunt.registerTask('messages:post', "Creates a new message.", function() {
    var done = this.async();

    var req = request({
      method: 'POST',
      uri: `${baseUrl}/messages`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'template': {
          'channels': {
            'required': ['email'],
          },
          'default': {
            'title': "Hello from Postways",
            'body': "This is a message send through the Postways API.",
          }
        },
        'recipients': [{
          email: "john.doe@postways.com",
          chat: {
            username: 'username',
            channel: 'channel',
          },
          vars: {
            foo: "Foo",
            bar: "Bar",
          }
        }]
      })
    },
    function(error, res, body) {
      console.log(dumpRes(res));

      assert.equal(res.statusCode, 201);

      done();
    });

    grunt.log.writeln(dumpReq(req));
  });

  grunt.registerTask('default', function() {});
}
