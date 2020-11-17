# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "electrical_manufacturing"
app_title = "Electrical Manufacturing"
app_publisher = "Momscode Technologies Pvt Ltd"
app_description = "Custom Application For Electrical Manufacturing"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@momscode.in"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/electrical_manufacturing/css/electrical_manufacturing.css"
# app_include_js = "/assets/electrical_manufacturing/js/electrical_manufacturing.js"

# include js, css files in header of web template
# web_include_css = "/assets/electrical_manufacturing/css/electrical_manufacturing.css"
# web_include_js = "/assets/electrical_manufacturing/js/electrical_manufacturing.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
#doctype_js = {"doctype" : "public/js/doctyp.js"}
doctype_js = {
    "Material Request" : "public/js/doctype_js/material_request.js",
    "Production Plan" : "public/js/doctype_js/production_plan.js",
    "Purchase Receipt" : "public/js/doctype_js/purchase_receipt.js",
    "Quotation" : "public/js/doctype_js/quotation.js",
    "Work Order" : "public/js/doctype_js/work_order.js",
    "Lead" : "public/js/doctype_js/lead.js",
    "BOM" : "public/js/doctype_js/bom.js",
    "Sales Order":"public/js/doctype_js/sales_order.js",
    "Salary Slip":"public/js/doctype_js/salary_slip.js",
    }

doctype_list_js = {"Opportunity":"public/js/doctype_js/opportunity_list.js",}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "electrical_manufacturing.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "electrical_manufacturing.install.before_install"
# after_install = "electrical_manufacturing.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "electrical_manufacturing.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    "BOM": {
        "on_change":"electrical_manufacturing.electrical_manufacturing.doctype.bom.custom_bom.on_BOM_after_submit"
    },
    "Sales Order":{
        "on_submit":"electrical_manufacturing.electrical_manufacturing.doctype.sales_order.sales_order.on_sales_order_on_submit"
    }
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
 }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"electrical_manufacturing.tasks.all"
# 	],
# 	"daily": [
# 		"electrical_manufacturing.tasks.daily"
# 	],
# 	"hourly": [
# 		"electrical_manufacturing.tasks.hourly"
# 	],
# 	"weekly": [
# 		"electrical_manufacturing.tasks.weekly"
# 	]
# 	"monthly": [
# 		"electrical_manufacturing.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "electrical_manufacturing.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "electrical_manufacturing.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "electrical_manufacturing.task.get_dashboard_data"
# }
fixtures = ["Custom Field"]