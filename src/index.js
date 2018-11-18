//@ts-check
/// <reference path="../types/index.d.ts" />

require('colors');

const app = require('commander');
const fs = require('fs-extra');
const path = require('path');

const account = require('./account');

module.exports = { main };

/**
 * @param {string[]} argv
 */
function main(argv) {
	const pkg = loadPackage();

	// read account info on the disk before other actions
	account.getAllAcounts(true);

	app.version(pkg.version);
	app.command('account')
		.alias('a')
		.description('vultr account operation. action: ' + 'add, login, list, remove'.cyan)
		.usage('<action> [options]')
		.on('--help', () => {
			console.log([
				'  example:',
				'    1. add(login) a account\n',
				'      account add <apiKey>\n'.grey,
				'    2. remove a account\n',
				'      account remove <apiKey>'.grey,
				'      account remove <apiKeyPrefix>\n'.grey,
				'      account remove <email>\n'.grey,
				'      account remove <name>\n'.grey,
				'    3. list accounts\n',
				'      account list\n'.grey
			].join('\n'));
		})
		.action((subAction, ...args) => {
			const methods = require('./action/account');

			if (Object.prototype.hasOwnProperty.call(methods, subAction)) {
				try {
					methods[subAction].apply(this, args);
				} catch (error) {
					console.error(`${subAction} account failed!`.red.bold);
					console.error(error.stack || error);
				}
				return;
			}

			console.error(`\n  error: action "${typeof subAction == 'string' ? subAction : ''}" is invalid!\n`.red);
		});

	app.command('info')
		.alias('i')
		.description('display basic information of vultr account')
		.action(function () {
			require('./action/info').info();
		});

	app.parse(argv);
}

/** @returns {NPMPackage} */
function loadPackage() {
	try {
		return fs.readJSONSync(path.join(__dirname, '..', 'package.json'), { encoding: 'utf8' });
	} catch (err) {
		console.error(err.stack);
		throw new Error('load package.json failed!');
	}
}

