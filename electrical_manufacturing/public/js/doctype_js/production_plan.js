frappe.ui.form.on("Production Plan",{
	refresh: function(frm){
		//code here
	},
	default_warehouse: function(frm) {
		$.each(frm.doc.mr_items || [], function(i, v) {
			frappe.model.set_value(v.doctype, v.name, "warehouse",frm.doc.default_warehouse)
		})
	}
});
frappe.ui.form.on('Production Plan Item', {
	/*po_items_add: function(frm,cdt,cdn) {
		//not working
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "short_description",d.item_code);		
	},
	po_items_on_form_rendered:function(frm,cdt,cdn){
		//not working
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "short_description",d.item_code);
	*/
});