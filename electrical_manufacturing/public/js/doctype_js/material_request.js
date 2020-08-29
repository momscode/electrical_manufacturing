frappe.ui.form.on("Material Request",{
	production_plan_no: function(frm) {
		$.each(frm.doc.items || [], function(i, v) {
			frappe.model.set_value(v.doctype, v.name, "production_plan",frm.doc.production_plan_no)
		})
	}
});
