import frappe

from frappe.model.naming import set_name_by_naming_series

def on_sales_order_on_submit(doc, handler=""):
    item_list = frappe.db.sql("""select si.name,si.item_code,si.item_name,si.qty,si.delivery_date,si.bom_no
    from `tabSales Order Item` si, `tabSales Order` s
    where s.name = si.parent and si.parenttype = 'Sales Order'
    and s.docstatus = 1 and si.parent = %s""",(doc.name),as_dict=1)
    for d in item_list:
        for x in range(int(d.qty)):
            item = frappe.new_doc('Production Plan')
            item.flags.ignore_permissions  = True
            item.production_plan_name = doc.name +'_'+d.item_code+'_'+ 'Q'+str(x+1)
            item.planned_completion_date = d.delivery_date
            item.for_warehouse="Work In Progress - RNG"
            item.default_warehouse="Work In Progress - RNG"
            item.get_items_for_mr=True
            item_list1 = frappe.db.sql("""select name ,transaction_date,customer,grand_total from `tabSales Order` where name=%s """,(doc.name),as_dict=1)
            for j in item_list1:
                item.append('sales_orders', {
                    'sales_order': doc.name,
                    'sales_order_date': j.transaction_date,
                    'customer':j.customer,
                    'grand_total':j.grand_total
               })
            item_list2 = frappe.db.sql("""select si.item_code,si.item_name,si.qty,si.delivery_date,si.bom_no
            from `tabSales Order Item` si, `tabSales Order` s
            where s.name = si.parent and si.parenttype = 'Sales Order'
            and s.docstatus = 1 and si.parent = %s and si.item_code=%s""",(doc.name,d.item_code),as_dict=1)
            for i in item_list2:
                item.append('po_items', {
                    'include_exploded_item':1,
                    'item_code': i.item_code,
                    'bom_no': i.bom_no,
                    'planned_qty': 1,
                })

            item.flags.ignore_permissions  = True

            item.update({
                'production_plan_name':item.production_plan_name,
                'planned_completion_date': item.planned_completion_date,
                'for_warehouse':item.for_warehouse,
                'item_code':item.item_code,
                'get_items_for_mr':item.get_items_for_mr,
                'default_warehouse':item.default_warehouse,
                'sales_orders': item.sales_orders,
                'po_items':item.po_items
            }).insert()
    frappe.msgprint(msg = 'Production Plan has been created',
        title = 'Notification',
        indicator = 'green'
    )
    return 