
frappe.ui.form.on('BOM', {
    validate: function (frm, cdt, cdn) {
        var total_oc = 0;
        var total_mc = 0;
        var nested_material_cost = 0;
        var nested_operating_cost = 0;
        var amc = 0;
        $.each(frm.doc.items || [], function (i, s) {
            if (s.bom_no != '') {
                var bom = s.bom_no
                frappe.call({
                    method: 'frappe.client.get_value',
                    args: {
                        'doctype': 'BOM',
                        'filters': {
                            'name': bom,
                        },
                        'fieldname': ['name', 'raw_material_cost', 'operating_cost']
                    },
                    callback: function (r) {
                        if (!r.exc) {
                            var mc = (r.message.raw_material_cost) * (s.qty);
                            var oc = (r.message.operating_cost) * (s.qty);
                            total_mc += mc;
                            total_oc += oc;
                            frm.set_value("mc_cost", total_mc);
                            frm.set_value("oc_cost", total_oc);
                        }
                        frm.set_value("mc_cost", total_mc);
                    }
                });
            }
            else {
                amc += s.amount;
                frm.set_value("ncost", amc);
            }
        });
       
    },
    mc_cost: function (frm) {
        var nmc = frm.doc.mc_cost + frm.doc.ncost
        frm.set_value("nested_material_cost", nmc)
        var nested_operating_cost = 0;
        nested_operating_cost = frm.doc.operating_cost + frm.doc.oc_cost
        frm.set_value("nested_operating_cost", nested_operating_cost);
        var total=nested_operating_cost+nmc
        frm.set_value("total_nested_bom_cost",total)
    }
});
