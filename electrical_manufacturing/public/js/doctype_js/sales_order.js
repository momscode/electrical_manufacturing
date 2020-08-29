frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {
        //refresh function
    },
    validate: function(frm) {
        if(frm.doc.__islocal) {
            frappe.call({
                 method: 'frappe.client.get_value',
                 args: {
                        'doctype': 'Customer',
                        'filters': {'name': frm.doc.customer},
                        'fieldname': [
                                'workflow_state'
                         ]
                },
             callback: function(r) {
                if (!r.exc) {
                    if(r.message.workflow_state != 'Approved')
                    {
                     msgprint('Customer not in Approved state . Customer must be in Approved State before creating Sales Order');
                     validated = false;
                    }
                }
             }
            });
        }
    }
});