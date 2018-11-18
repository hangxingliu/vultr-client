//@ts-check

module.exports = {
	createAssertContext
};

function createAssertContext(contextName) {
	const e = desc => new Error(`${desc} (in ${contextName})`);

	const chain = {
		nonEmptyString,
		validateFields,
	};
	return chain;

	/**
	 * @param {string} value
	 * @param {string} name
	 */
	function nonEmptyString(value, name) {
		if (typeof value !== 'string' || !value)
			throw e(`${name}(${JSON.stringify(value)}) is not string or empty!`);
	}

	/**
	 * @param {any} value
	 * @param {{[key: string]: string}} fields
	 */
	function validateFields(value, name, fields) {
		if (typeof value !== 'object' || !value)
			throw e(`${name}(${JSON.stringify(value)}) is not an object!`);
		Object.keys(fields).forEach(fieldName => {
			if (!Object.prototype.hasOwnProperty.call(value, fieldName))
				throw e(`${name}.${fieldName} is missing!`);

			const expectedType = fields[fieldName];
			if (expectedType === 'any') return;
			if (expectedType === 'array') {
				if (Array.isArray(value[fieldName]))
					return;
				throw e(`${name}.${fieldName} is not an array!`);
			}
			if (expectedType !== typeof value[fieldName])
				throw e(`typeof ${name}.${fieldName} is not ${expectedType}!`);
		});
	}
}
