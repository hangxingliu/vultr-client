//@ts-check
/// <reference path="../../types/index.d.ts" />

const req = require('request');
const { getStatusCodeMessage } = require('./status-code');

const VULTR_API = 'https://api.vultr.com/';


module.exports = { requestVultr, request, getVultrResponseObject };

/**
 *
 * @param {string} method
 * @param {string} uri
 * @param {string|false} apiKey
 * @param {req.CoreOptions} [options]
 */
function requestVultr(method, uri, apiKey, options) {
	/** @type {req.CoreOptions} */
	let baseOptions = { method, baseUrl: VULTR_API };
	if (apiKey !== false)
		baseOptions.headers = { 'API-Key': apiKey };

	if (typeof options === 'object' && options)
		baseOptions = Object.assign(baseOptions, options);

	return request(uri, baseOptions);
}

/**
 *
 * @param {string} uri
 * @param {req.CoreOptions} [options]
 * @returns {Promise<{response: req.Response, body: any}>}
 */
function request(uri, options) {
	return new Promise((resolve, reject) => {
		req(uri, options, (error, response, body) => {
			if (error) return reject(error);
			return resolve({ response, body });
		});
	});
}

/**
 * @param {{response: req.Response, body: any}} response
 * @returns {any}
 */
function getVultrResponseObject(response) {
	const { statusCode } = response.response;
	if (statusCode !== 200)
		throw new Error(`Vultr response ${statusCode} (${getStatusCodeMessage(statusCode)})`);

	try {
		return JSON.parse(response.body);
	} catch (error) {
		throw new Error('Vultr response body is invalid JSON!');
	}
}
