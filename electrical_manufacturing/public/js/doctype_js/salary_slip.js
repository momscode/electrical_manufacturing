frappe.ui.form.on("Salary Slip", {
    validate: function(frm) {
        frappe.call({
            method:"electrical_manufacturing.electrelectrical_manufacturing.doctype.salary_slip.salary_slip.get_count_employee_attendance",
            args:{
                frm:frm
            },
            callback: function(s) {
                if(!s.exc){
                    alert(s.message.attendances)
                }
                
            }
        });
    }
});