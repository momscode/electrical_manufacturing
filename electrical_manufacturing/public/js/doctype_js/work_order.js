frappe.ui.form.on("Work Order",{
	default_source_warehouse: function(frm) {
		$.each(frm.doc.required_items || [], function(i, v) {
			frappe.model.set_value(v.doctype, v.name, "source_warehouse",frm.doc.default_source_warehouse)
		})
	}
});