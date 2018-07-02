
require('dotenv').config()

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
        environment: 'dev',
        template: {
          channels: {
            required: ['email'/*, 'sms'*/],
          },
          default: {
            title: "Hello from Postways",
            body: "This is a {{ baz }} message {{ foo }} send {{ bar }} through the Postways API.",
          },
          email: {
            body: {
              html: "This is a <b>{{ baz }}</b> message <b>{{ foo }}</b> send <b>{{ bar }}</b> through the Postways API.",
            },
            isHtml: true,
          },
          sms: {
            body: "This is a {{ foo }} test {{ bar }} 123."
          },
          vars: {
            baz: "Baz",
          }
        },
        recipients: [{
          email: "info@postways.com",
          chat: {
            username: 'username',
            channel: 'channel',
          },
          phone: process.env.PHONE ? `${process.env.PHONE}` : undefined,
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
