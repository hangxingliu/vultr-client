//@ts-check
/// <reference path="../../types/index.d.ts" />

require('colors');
const { requestVultr, getVultrResponseObject } = require('../request');
const { createAssertContext } = require('../assert');
const accountManager = require('../account');
const leftPad = require('left-pad');


module.exports = { info };

function info() {
	const assert = createAssertContext('getAccountInfo');

	const allAcounts = accountManager.getAllAcounts();
	if (allAcounts.length <= 0)
		throw new Error('List account failed! (you need add at least one account)');
	const account = allAcounts[0];

	console.log(`Fetching basic info of "${account.name}" ${account.email} ...`);
	requestVultr('GET', '/v1/account/info', account.apiKey)
		.then(response => {
			/** @type {VultrAccountInfo} */
			const result = getVultrResponseObject(response);
			assert.validateFields(result, 'response', {
				balance: 'string', pending_charges: 'string',
				last_payment_date: 'string', last_payment_amount: 'string',
			});

			const balance = -Number(result.balance);
			const pendingCharges = -Number(result.pending_charges);
			const printInfo = {
				balance: balance.toFixed(2),
				pendingCharges: pendingCharges.toFixed(2),
				realBalance: (balance + pendingCharges).toFixed(2),
				lastPaymentDate: result.last_payment_date,
				lastPaymentAmount: (-Number(result.last_payment_amount)).toFixed(2)
			};
			const w = Math.max(...[
				printInfo.balance,
				printInfo.pendingCharges,
				printInfo.realBalance
			].map(it => it.length));

			console.log([
				'Account info:',
				`  Last recharge amount:  ${('+' + printInfo.lastPaymentAmount).green}`,
				`  Last recharge date:    ${printInfo.lastPaymentDate.cyan}`,
				'  ********************************',
				`  Balance:                ${leftPad(printInfo.balance, w).grey}`,
				`  Pending charges:        ${leftPad(printInfo.pendingCharges, w).red}`,
				`  Real balance:          =${leftPad(printInfo.realBalance, w).cyan}`,
				''
			].join('\n'));
		}).then(() => {
			console.log('Fetching account\'s server info ...');
			return requestVultr('GET', '/v1/server/list', account.apiKey);
		}).then(function (response) {
			/** @type {{[id: string]: VultrServerInfo}} */
			const result = getVultrResponseObject(response);
			for (const serverId in result) {
				const server = result[serverId];

				const {
					status, power_status: powerStatus, server_state: serverState,
					os, ram, disk,
					pending_charges: pendingCharges, cost_per_month: costPerMonth,
					main_ip: mainIP,
					location
				} = server;
				const currentBandwidth = server.current_bandwidth_gb;
				const allowedBandwidth = Number.parseFloat(server.allowed_bandwidth_gb);

				const bandwidthPercent = currentBandwidth / allowedBandwidth * 100;

				console.log([
					`${server.label.green} (${status} | ${powerStatus} | ${serverState}):`,
					`  ${'IP<Location>:'.grey}          ${mainIP} <${location.gray}>`,
					`  ${'OS/RAM/Disk:'.grey}           ${os} / ${ram} / ${disk}`,
					`  ${'Cost(Pending/Month):'.grey}   ${pendingCharges} $ / ${costPerMonth} $`,
					`  ${'Bandwidth(Now/Month):'.grey}  ` +
					`${currentBandwidth} GB / ${allowedBandwidth} GB` +
					` (${bandwidthPercent.toFixed(2).cyan}${'%'.cyan})`,
					'',
				].join('\n') + '\n');
			}
		}).catch(error => {
			console.error('Fetch account info failed!'.red.bold);
			console.error(error.stack || error);
		});
}
