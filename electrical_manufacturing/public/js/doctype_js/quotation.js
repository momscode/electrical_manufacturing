frappe.ui.form.on("Quotation", {
    refresh: function(frm){

    },
    onload:function(frm){
        if(frm.doc.opportunity && frm.doc.__islocal){
            
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    'doctype': 'Opportunity',
                    'filters': {
                        'name': frm.doc.opportunity
                    },
                    'fieldname': [
                        'title',
                        'opportunity_type'
                    ]                   
                },
                callback: function(n){
                    if(!n.exc){
                        frm.set_value("title",n.message.title);
                        frm.set_value("order_type",n.message.opportunity_type);
                    }
                }
            })
        }
    },
	/*validate: function(frm) {
		var total_price_list_rate = 0;
		$.each(frm.doc.items || [], function(i, d) {
			total_price_list_rate+= flt(d.price_list_rate) * flt(d.qty);
		});
        frm.set_value("total_margin_amount",frm.doc.total - total_price_list_rate);
		frm.set_value("total_price_list_rate", total_price_list_rate);
    },
    default_margin: function(frm) {
        $.each(frm.doc.items || [], function(i, v) {
            frappe.model.set_value(v.doctype, v.name,"margin_rate_or_amount",frm.doc.default_margin)
        })
    }*/
    
});
frappe.ui.form.on('Quotation Item', {
    item_code: function(frm,cdt,cdn){
        var d = locals[cdt][cdn];
        var item_code = d.item_code;
        frappe.call({
            method:"frappe.client.get_value",
            args: {
                doctype:"BOM",
                filters: {
                    item: item_code,
                    is_default : 1
                },
                fieldname:["name","nested_operating_cost","nested_material_cost"]
            }, 
            callback: function(r) { 
               
                frappe.model.set_value(d.doctype, d.name,"bom_no",r.message.name)
                frappe.model.set_value(d.doctype, d.name,"material_cost",r.message.nested_material_cost)
                frappe.model.set_value(d.doctype, d.name,"activity_cost",r.message.nested_operating_cost)
                var rate = 0;
                var activity_rate = 0;
                var material_overhead = 0;
                var activity_overhead = 0;
                material_overhead = flt(d.material_cost)*(flt(d.material_overhead)/100);
                frappe.model.set_value(d.doctype, d.name,"material_overhead_amount",material_overhead)
                activity_overhead = flt(d.activity_cost)*(flt(d.activity_overhead)/100);
                frappe.model.set_value(d.doctype, d.name,"activity_overhead_amount",activity_overhead)
                var amount =flt(d.material_cost)+flt(d.material_overhead_amount);
                rate =flt(amount)*(flt(d.material_margin)/100);
                frappe.model.set_value(d.doctype, d.name,"material_margin_amount",rate)
                var amount =flt(d.activity_cost)+flt(d.activity_overhead_amount);
                activity_rate = flt(amount)*(flt(d.activity_margin)/100);
                frappe.model.set_value(d.doctype, d.name,"activity_margin_amount",activity_rate)
            }
        })
     },
     material_overhead: function(frm,cdt,cdn) {
        var d = locals[cdt][cdn];
        var material_overhead = 0;
        var total_rate =0;
        var margin = 0;
        var rate = 0;
        material_overhead = flt(d.material_cost)*(flt(d.material_overhead)/100);
        frappe.model.set_value(d.doctype, d.name,"material_overhead_amount",material_overhead)
        if(d.material_margin != 0)
        {
        var amount =flt(d.material_cost)+flt(d.material_overhead_amount);
        rate = flt(amount)*(flt(d.material_margin)/100);
        frappe.model.set_value(d.doctype, d.name,"material_margin_amount",rate)
        }
        var total_rate =0;
        var total_rate1 =0;
        total_rate =d.material_cost + d.material_margin_amount +d.material_overhead_amount;
        frappe.model.set_value(d.doctype, d.name,"total_material_amount_with_margin",total_rate)
        total_rate1 = d.material_margin_amount +d.activity_margin_amount+d.material_overhead_amount+d.activity_overhead_amount;
        frappe.model.set_value(d.doctype, d.name,"margin_rate_or_amount",total_rate1)
    },
    activity_overhead: function(frm,cdt,cdn) {
        var d = locals[cdt][cdn];
        var activity_overhead = 0;
        activity_overhead = flt(d.activity_cost)*(flt(d.activity_overhead)/100);
        frappe.model.set_value(d.doctype, d.name,"activity_overhead_amount",activity_overhead)
        if(d.activity_margin != 0)
        {
        var amount =flt(d.activity_cost)+flt(d.activity_overhead_amount);
        var rate = flt(amount)*(flt(d.activity_margin)/100);
        frappe.model.set_value(d.doctype, d.name,"activity_margin_amount",rate)
        }
        var total_rate =d.activity_cost + d.activity_margin_amount +d.activity_overhead_amount;
        frappe.model.set_value(d.doctype, d.name,"total_activity_amount_with_margin",total_rate)
        var total_rate1 = d.material_margin_amount +d.activity_margin_amount+d.activity_overhead_amount+d.material_overhead_amount;
        frappe.model.set_value(d.doctype, d.name,"margin_rate_or_amount",total_rate1)
        
    },
    material_margin: function(frm,cdt,cdn) {
        var d = locals[cdt][cdn];
        var rate = 0;
        var amount =flt(d.material_cost)+flt(d.material_overhead_amount);
        rate = flt(amount)*(flt(d.material_margin)/100);
        frappe.model.set_value(d.doctype, d.name,"material_margin_amount",rate)
    },
    activity_margin: function(frm,cdt,cdn) {
        var d = locals[cdt][cdn];
        var activity_rate = 0;
        var amount =flt(d.activity_cost)+flt(d.activity_overhead_amount);
        activity_rate = flt(amount)*(flt(d.activity_margin)/100);
        frappe.model.set_value(d.doctype, d.name,"activity_margin_amount",activity_rate)
    },
    activity_cost:function(frm,cdt,cdn)
{
    var d = locals[cdt][cdn];
    var total_rate =d.activity_cost;
    frappe.model.set_value(d.doctype, d.name,"total_activity_amount_with_margin",total_rate)
},
material_cost:function(frm,cdt,cdn)
{
    var d = locals[cdt][cdn];
    var total_rate =d.material_cost;
    frappe.model.set_value(d.doctype, d.name,"total_material_amount_with_margin",total_rate)
},
material_margin_amount: function(frm,cdt,cdn) {
    var d = locals[cdt][cdn];
    var rate = 0;
    var total_rate =0;
    var total_rate1 =0;
    total_rate =d.material_cost + d.material_margin_amount +d.material_overhead_amount;
    frappe.model.set_value(d.doctype, d.name,"total_material_amount_with_margin",total_rate)
    total_rate1 = d.material_margin_amount +d.activity_margin_amount+d.material_overhead_amount+d.activity_overhead_amount;
    frappe.model.set_value(d.doctype, d.name,"margin_rate_or_amount",total_rate1)
    
},
activity_margin_amount: function(frm,cdt,cdn) {
    var d = locals[cdt][cdn];
    var rate = 0;
    var total_rate =0;
    var total_rate1 =0;
     total_rate =d.activity_cost + d.activity_margin_amount +d.activity_overhead_amount;
    frappe.model.set_value(d.doctype, d.name,"total_activity_amount_with_margin",total_rate)
    total_rate1 = d.material_margin_amount +d.activity_margin_amount+d.activity_overhead_amount+d.material_overhead_amount;
    frappe.model.set_value(d.doctype, d.name,"margin_rate_or_amount",total_rate1)
}   
    });

    frappe.ui.form.on("Quotation", {
        validate:function(frm) {
            var total_price_list_rate = 0;
            var total_margin_amount = 0;
            $.each(frm.doc.items || [], function(i, d) {
            total_price_list_rate+= flt(d.price_list_rate) * flt(d.qty);
        });
        frm.set_value("total_margin_amount",frm.doc.total - total_price_list_rate);
        frm.set_value("total_price_list_rate", total_price_list_rate);
            var total_Material_cost= 0;
            var total_activity_cost = 0;
            var total_activity_margin_amount = 0;
            var total_Material_margin_amount = 0;
            var total_Material_with_margin = 0;
            var total_activity_with_margin= 0;
            var activity_cost = 0;
            var total_material_overhead =0;
            var  total_activity_overhead =0;
            var total_overhead_amount =0;
            $.each(frm.doc.items || [], function(i, v) {
                total_Material_cost = total_Material_cost + v.material_cost
                total_activity_cost = total_activity_cost + v.activity_cost 
                total_Material_margin_amount = total_Material_margin_amount + v.material_margin_amount 
                total_activity_margin_amount = total_activity_margin_amount + v.activity_margin_amount
                total_Material_with_margin = total_Material_with_margin + v.total_material_amount_with_margin
                total_activity_with_margin = total_activity_with_margin + v.total_activity_amount_with_margin
                total_material_overhead     = total_material_overhead + v.material_overhead_amount
                total_activity_overhead     = total_activity_overhead + v.activity_overhead_amount
            })  
            frm.set_value("total_material_cost",total_Material_cost);
            frm.set_value("total_activity_cost",total_activity_cost);
            frm.set_value("total_material_margin_",total_Material_margin_amount);
            frm.set_value("total_activity_margin",total_activity_margin_amount);
            frm.set_value("total_material_with_margin",total_Material_with_margin);
            frm.set_value("total_activity_with_margin",total_activity_with_margin);
            frm.set_value("total_material_overhead",total_material_overhead);
            frm.set_value("total_activity_overhead",total_activity_overhead);
            total_overhead_amount =frm.doc.total_material_overhead +frm.doc.total_activity_overhead;
            frm.set_value("total_overhead_amount",total_overhead_amount);
        },  
        
        onload:function(frm)
        {
            $("Button[data-fieldname=apply_defaults_to_all]").addClass("btn-primary");
        }, 
        default_material_margin: function(frm) {
            cur_frm.fields_dict.apply_defaults_to_all.$input.on("click", function(evt){
            $.each(frm.doc.items || [], function(i, v) {
                frappe.model.set_value(v.doctype, v.name,"material_margin",frm.doc.default_material_margin)
                frappe.model.set_value(v.doctype, v.name,"activity_margin",frm.doc.default_activity__margin)
                frappe.model.set_value(v.doctype, v.name,"activity_overhead",frm.doc.default_activity_overhead)
                frappe.model.set_value(v.doctype, v.name,"material_overhead",frm.doc.material_overhead)
            })
        }) 
           
     },  
     default_activity__margin: function(frm) {
        cur_frm.fields_dict.apply_defaults_to_all.$input.on("click", function(evt){
            $.each(frm.doc.items || [], function(i, v) {
                frappe.model.set_value(v.doctype, v.name,"material_margin",frm.doc.default_material_margin)
                frappe.model.set_value(v.doctype, v.name,"activity_margin",frm.doc.default_activity__margin)
                frappe.model.set_value(v.doctype, v.name,"activity_overhead",frm.doc.default_activity_overhead)
                frappe.model.set_value(v.doctype, v.name,"material_overhead",frm.doc.material_overhead)
            })
        })
    },
    default_activity_overhead: function(frm) {
        cur_frm.fields_dict.apply_defaults_to_all.$input.on("click", function(evt){
            $.each(frm.doc.items || [], function(i, v) {
                frappe.model.set_value(v.doctype, v.name,"material_margin",frm.doc.default_material_margin)
                frappe.model.set_value(v.doctype, v.name,"activity_margin",frm.doc.default_activity__margin)
                frappe.model.set_value(v.doctype, v.name,"activity_overhead",frm.doc.default_activity_overhead)
                frappe.model.set_value(v.doctype, v.name,"material_overhead",frm.doc.material_overhead)
            })
        })
    },
    material_overhead: function(frm) {
        cur_frm.fields_dict.apply_defaults_to_all.$input.on("click", function(evt){
            $.each(frm.doc.items || [], function(i, v) {
                frappe.model.set_value(v.doctype, v.name,"material_margin",frm.doc.default_material_margin)
                frappe.model.set_value(v.doctype, v.name,"activity_margin",frm.doc.default_activity__margin)
                frappe.model.set_value(v.doctype, v.name,"activity_overhead",frm.doc.default_activity_overhead)
                frappe.model.set_value(v.doctype, v.name,"material_overhead",frm.doc.material_overhead)
            })
        })
    }
    });