type NPMPackage_StringMap = { [x: string]: string };

type NPMPackage = {
	name: string;
	version: string;
	description: string;
	main: string;
	scripts: NPMPackage_StringMap;
	bin: {
		vultr: string;
	};
	keywords: string[];
	author: {
		name: string;
		email: string;
	};
	license: string;
	repository: {
		url: string;
		type: string;
	};
	dependencies: NPMPackage_StringMap;
}
