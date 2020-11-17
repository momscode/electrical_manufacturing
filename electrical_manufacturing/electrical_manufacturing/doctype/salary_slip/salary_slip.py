from __future__ import unicode_literals
import frappe, erpnext
import datetime, math
from frappe import msgprint, _


def get_count_employee_attendance(frm):
    marked_days = 0
    frappe.msgprint(frm.employye)
    attendances = frappe.db.sql("""select count(*) from tabAttendance where employee=%s and docstatus=1 and status="Present" and attendance_date between %s and %s""",
    (frm.employee, frm.start_date, frm.end_date))
    if attendances and attendances[0][0]:
        marked_days = attendances[0][0]
    return attendances

