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
	validate: function(frm) {
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
    }
    
});