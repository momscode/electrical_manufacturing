frappe.listview_settings['Opportunity'] = {
	add_fields: ["customer_name", "opportunity_type", "opportunity_from","sales_stage"],
	get_indicator: function(doc) {
		var indicator = [__(doc.sales_stage), frappe.utils.guess_colour(doc.sales_stage), "sales_stage,=," + doc.sales_stage];
		if(doc.sales_stage=="Proposal/Price Quote") {
			indicator[1] = "green";
        }
        if(doc.sales_stage=="Closed Lost") {
			indicator[1] = "grey";
        }
        if(doc.sales_stage=="Prospecting") {
			indicator[1] = "red";
		}
		return indicator;
    },
}