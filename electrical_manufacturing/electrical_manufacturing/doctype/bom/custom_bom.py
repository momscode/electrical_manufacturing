import frappe
from frappe import _
@frappe.whitelist()
def get_cost_of_bom(bom):
    frappe.msgprint(bom)
    return frappe.db.sql("""select raw_material_cost from `tabBOM` where name = %s and docstatus = 1""",(bom))

def on_BOM_after_submit(doc,Handler= ""):
    bom_item_list = frappe.db.sql("""select item_code from `tabItem Price` where item_code= %s """,(doc.item),as_dict=1)
    if not bom_item_list:
            project = frappe.new_doc('Item Price')
            project.Item_code = doc.item
            project.uom = doc.uom
            project.price_list = 'Standard Selling'
            project.quantity=doc.quantity
            project.price_list_rate = doc.total_cost/doc.quantity
            project.flags.ignore_permissions  = True
            project.update({
            'item_code': project.Item_code,
            'uom': project.uom,
            'price_list': project.price_list,
            'price_list_rate': project.price_list_rate
            }).insert()
            frappe.msgprint(msg = 'Item Price Created',
            title = 'Notification',
            indicator = 'green')
    else:
        
            frappe.db.sql("""update `tabItem Price` set price_list_rate = %s where item_code =%s""",((doc.total_cost/doc.quantity), doc.item))
            frappe.msgprint(msg = 'Item Price Updated',
            title = 'Notification',
            indicator = 'green')
   
   
    return