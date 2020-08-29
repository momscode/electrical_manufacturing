//this function may be not going to use
frappe.ui.form.on("Purchase Receipt", {
	setup: function(frm) {
		 if (!frm.doc.__islocal) {
		 frm.set_indicator_formatter('item_code',
                        function(doc) {
			    return 'green';
                        })
		}
		else{
		       frm.set_indicator_formatter('item_code',
                          function(doc) {
				if(doc.purchase_uom)
			  return (doc.uom != doc.purchase_uom) ? "orange" : "green"
                        })
		}
	   },
	/*onload: function(frm) {
		 frm.set_indicator_formatter('item_code',
                        function(doc) {
                                      return 'blue';
                        })
	   },*/
	refresh: function(frm) {
		 frm.set_indicator_formatter('item_code',
                        function(doc) {
					if(doc.purchase_uom)
                                        return (doc.uom!=doc.purchase_uom) ? "orange" : "green"
                        })
	   },
	validate:function(frm) {
	$.each(frm.doc.items , function(i, d) {
                  var ab = d.item_code;
		if(d.purchase_qty == '0' && d.purchase_rate == '0')
			{
				frappe.msgprint(__(`please enter purchased quantity and purchase rate for ${d.item_code} `));
				frappe.validated=false;
			}
frappe.call({
    method: 'frappe.client.get_value',
    args: {
        'doctype': 'Item',
        'filters': {'name': ab},
        'fieldname': [
            'item_group'
        ]
    },
    callback: function(r) {
        if (!r.exc) {
//msgprint(r.message.item_group)
//-----get parent item group-----------
frappe.call({
    method: 'frappe.client.get_value',
    args: {
        'doctype': 'Item Group',
        'filters': {'name':r.message.item_group },
        'fieldname': [
            'parent_item_group'
        ]
    },
    callback: function(s) {
	if (!s.exc) {
		if(s.message.parent_item_group == 'Enclosure Modular Components')
			{
				if(d.uom != d.purchase_uom)
				{
					if(d.purchased_qty_in_nos == '0')
					{
						frappe.msgprint(__(`please enter purchased quantity in numbers in row#${d.idx} `));
						frappe.validated=false;
					}
				}
			}
	}
      }
})
//-----------------------
    }
 }
})
	  })
	},
       modular_components: function(frm) {
       if(frm.doc.modular_components)
	{
	  $.each(frm.doc.items , function(i, d) {
                  var ab = d.item_code;
frappe.call({
    method: 'frappe.client.get_value',
    args: {
        'doctype': 'Item',
        'filters': {'name': ab},
        'fieldname': [
            'item_group'
        ]
    },
    callback: function(r) {
        if (!r.exc) {
//msgprint(r.message.item_group)
//-----get parent item group-----------
frappe.call({
    method: 'frappe.client.get_value',
    args: {
        'doctype': 'Item Group',
        'filters': {'name':r.message.item_group },
        'fieldname': [
            'parent_item_group'
        ]
    },
    callback: function(s) {
	if (!s.exc) {
		if(s.message.parent_item_group == 'Enclosure Modular Components')
			{
				frappe.model.set_value(d.doctype, d.name,"purchase_uom",'Kg')
				//var df = frappe.meta.get_docfield("Purchase Receipt Item","qty", frm.doc.name);
				//df.read_only = 0;
			}
		else
			{
				frappe.model.set_value(d.doctype, d.name,"purchase_uom",d.uom)
			}
	}
      }
})
//-----------------------
    }
 }
})
	  })		
	}
	frm.refresh_field('items');
	frm.refresh();
    }
});
frappe.ui.form.on('Purchase Receipt Item', {
    purchase_amount: function(frm, cdt, cdn){
       var d = locals[cdt][cdn];
	//if(d.purchase_amount) {
           frappe.model.set_value(cdt, cdn, "rate", d.purchase_amount/d.qty);
      // }
     },
    qty: function(frm, cdt, cdn){
       var d = locals[cdt][cdn];
	//if(d.qty) {
           frappe.model.set_value(cdt, cdn, "rate", d.purchase_amount/d.qty);
       // }
     },
    purchased_qty_in_nos:function(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	//if(d.purchased_qty_in_nos) {
           frappe.model.set_value(cdt, cdn, "qty", d.purchased_qty_in_nos);
       // }
    },
    purchase_qty: function(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.uom==d.purchase_uom)
	{
		frappe.model.set_value(cdt, cdn, "qty", d.purchase_qty);
	}
	//if(d.purchase_rate && d.purchase_qty) {
	 frappe.model.set_value(cdt, cdn, "purchase_amount", d.purchase_rate*d.purchase_qty);
       // }
    },
    purchase_rate: function(frm, cdt, cdn){
       var d = locals[cdt][cdn];
	//if(d.purchase_rate && d.purchase_qty) {
           frappe.model.set_value(cdt, cdn, "purchase_amount", d.purchase_rate*d.purchase_qty);
      //  }
     },
     item_code: function(frm, cdt, cdn){
       var d = locals[cdt][cdn];
	 var ab = d.item_code;
	//-------to get item group of selected item----------
frappe.call({
    method: 'frappe.client.get_value',
    args: {
        'doctype': 'Item',
        'filters': {'name': ab},
        'fieldname': [
            'item_group',
	    'stock_uom'
        ]
    },
    callback: function(r) {
        if (!r.exc) {
//-----to get parent item group parent item group-----------
frappe.call({
    method: 'frappe.client.get_value',
    args: {
        'doctype': 'Item Group',
        'filters': {'name':r.message.item_group },
        'fieldname': [
            'parent_item_group'
        ]
    },
    callback: function(s) {
	if (!s.exc) {
		if(s.message.parent_item_group == 'Enclosure Modular Components')
			{
				frappe.model.set_value(d.doctype, d.name,"purchase_uom",'Kg')
				frappe.model.set_value(d.doctype, d.name,"uom",'Nos')
			}
		else
			{
				frappe.model.set_value(d.doctype, d.name,"purchase_uom",r.message.stock_uom)
				frappe.model.set_value(d.doctype, d.name,"uom",r.message.stock_uom)
			}
	//msgprint(s.message.parent_item_group);
	}
      }
})
//-----------------------
    }
 }
})
     }

});
