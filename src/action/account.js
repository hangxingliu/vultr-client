//@ts-check
/// <reference path="../../types/index.d.ts" />

require('colors');
const { requestVultr, getVultrResponseObject } = require('../request');
const { createAssertContext } = require('../assert');
const accountManager = require('../account');
const leftPad = require('left-pad');


module.exports = {
	add, login: add,
	list,
	remove,
};

function add(apiKey) {
	const assert = createAssertContext('addAccount');

	assert.nonEmptyString(apiKey, 'apiKey');
	console.log('Validating apiKey by API "/v1/auth/info" ...');
	requestVultr('GET', '/v1/auth/info', apiKey).then(response => {
		/** @type {VultrAuthInfo} */
		const result = getVultrResponseObject(response);
		assert.validateFields(result, 'response', {
			name: 'string',
			email: 'string',
			acls: 'array',
		});

		console.log([
			'Account Info:',
			`  name:  ${result.name.cyan}`,
			`  email: ${result.email.cyan}`,
			`  acls:  ${result.acls.join(', ').cyan}`,
		].join('\n'));

		accountManager.addAccount({ name: result.name, email: result.email, apiKey });
		console.log('Added account!'.green);
	}).catch(error => {
		console.error('Add account failed!'.red.bold);
		console.error(error.stack || error);
	});
}

function list() {
	const accounts = accountManager.getAllAcounts();

	const total = [['DEFAULT', '  NAME', '  EMAIL', '  APIKEY']];
	const length = [];
	let lengthAll = 0;
	total[0].forEach(v => length.push(v.length));
	accounts.forEach((v, i) => total.push([i == 0 ? 'DEFAULT ' : '', v.name, v.email, v.apiKey]));
	for (var y in total)
		for (var x in total[y])
			length[x] = Math.max(length[x], String(total[y][x]).length );

	length.forEach(v => lengthAll += v + 2);

	var output = '';
	total.forEach((v,i) => (
		v.forEach((vi, i2) => output += '  ' + leftPad(vi, length[i2])),
		output += i == 0 ? `\n${leftPad('', lengthAll + 1, '=')}\n ` : '\n '));

	console.log(output);
}

function remove(keyword) {
	const assert = createAssertContext('removeAccount');

	assert.nonEmptyString(keyword, 'apiKey');

	const oldAccount = accountManager.removeAccount(keyword);
	console.log(`Removed account (name: ${oldAccount.name}, email: ${oldAccount.email})!`.green);
}
