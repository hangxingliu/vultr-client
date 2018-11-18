//@ts-check
/// <reference path="../types/index.d.ts" />

const path = require('path');
const fs = require('fs-extra');

const FILE_NAME = '.vultrconfig';

/** @type {AccountInfo[]} */
let allAccounts = [];

module.exports = {
	getAllAcounts,

	addAccount,
	removeAccount,
};

/** @returns {AccountInfo[]} */
function getAllAcounts(ignoreCache = false) {
	if (allAccounts && ignoreCache === false)
		return allAccounts;

	const filePath = getFilePath();
	if (!fs.existsSync(filePath)) {
		allAccounts = [];
		return [];
	}

	const account = fs.readJSONSync(filePath, { encoding: 'utf8' });
	if (!Array.isArray(account))
		throw new Error(`Invalid config file (${filePath}): Root of JSON is not an array!`);
	account.forEach(shouldBeAnAccountObject);

	allAccounts = account;
	return account;
}

/** @param {AccountInfo} account */
function addAccount(account) {
	shouldBeAnAccountObject(account);

	const accountEmail = account.email;
	const newAllAccount = [...allAccounts];

	let updateAt = 0;
	for (let end = newAllAccount.length; updateAt < end; updateAt++)
		if (newAllAccount[updateAt].email === accountEmail)
			break;
	newAllAccount[updateAt] = account;

	fs.writeJSONSync(getFilePath(), newAllAccount, { spaces: '\t' });
	allAccounts = newAllAccount;
}

/**
 * @param {string} keyword
 * @returns {AccountInfo} account be removed
 */
function removeAccount(keyword) {
	/** @type {AccountInfo} */
	let removed = null;
	const lowercaseKeyword = keyword.toLowerCase();
	const newAllAccount = allAccounts.filter(account => {
		if (account.apiKey.toLowerCase().startsWith(lowercaseKeyword) ||
			account.email.toLowerCase() === lowercaseKeyword ||
			account.name && account.name.toLowerCase() === lowercaseKeyword) {
			removed = account;
			return false;
		}
		return true;
	});

	const matchedAccount = allAccounts.length - newAllAccount.length;
	if (matchedAccount !== 1) {
		const prefix = matchedAccount <= 0 ? 'no account' : `${matchedAccount} accounts`;
		const quotedKeyword = JSON.stringify(keyword);
		throw new Error(`removeAccount failed! ${prefix} be matched by keyword ${quotedKeyword}`);
	}

	fs.writeJSONSync(getFilePath(), newAllAccount, { spaces: '\t' });
	allAccounts = newAllAccount;
	return removed;
}

function getFilePath() {
	const { HOME } = process.env;
	if (typeof HOME !== 'string' || !HOME)
		throw new Error('HOME environment variable is missing!');

	return path.join(HOME, FILE_NAME);
}

/** @param {AccountInfo} account */
function shouldBeAnAccountObject(account) {
	if (typeof account !== 'object' || !account)
		throw new Error(`Invalid account object: ${typeof account}`);

	if (typeof account.apiKey !== 'string' || !account.apiKey)
		throw new Error('Invalid account object: account.apiKey is empty!');
	if (typeof account.email !== 'string' || !account.email)
		throw new Error('Invalid account object: account.email is empty!');

	if (typeof account.name !== 'string')
		throw new Error('Invalid account object: account.name is empty!');
}
