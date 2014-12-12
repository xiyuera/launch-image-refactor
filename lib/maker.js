#!/usr/bin/env node

var program       = require('commander');
var fs            = require('fs');
var ios_launchimg = require('./');
var path          = require('path');

program
    .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
    .usage('path/to/compare [path/to/target]')
    .parse(process.argv);

program.name = 'ios-launchimg';

var compDir = program.args[0];
var targDir = program.args[1];

targDir = targDir || path.resolve();

console.info("compare:", compDir);
console.info("target:", targDir);

ios_launchimg.make({
	compareDir: compDir,
	targetDir:  targDir,
});