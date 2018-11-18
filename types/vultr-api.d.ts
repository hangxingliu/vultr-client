type VultrAuthInfo = {
	acls: string[];
	email: string;
	name: string;
};

type VultrAccountInfo = {
	balance: string;
	pending_charges: string;
	last_payment_date: string;
	last_payment_amount: string;
};

type VultrServerInfo = {
	SUBID: string;
	os: string;
	ram: string;
	disk: string;
	main_ip: string;
	vcpu_count: string;
	location: string;
	DCID: string;
	default_password: string;
	date_created: string;
	pending_charges: string;
	status: string;
	cost_per_month: string;
	current_bandwidth_gb: number;
	allowed_bandwidth_gb: string;
	netmask_v4: string;
	gateway_v4: string;
	power_status: string;
	server_state: string;
	VPSPLANID: string;
	v6_main_ip: string;
	v6_network_size: string;
	v6_network: string;
	v6_networks: any[],
	label: string;
	internal_ip: string;
	kvm_url: string;
	auto_backups: string;
	tag: string;
	OSID: string;
	APPID: string;
	FIREWALLGROUPID: string;
};
