from odoo import api, fields, models, tools
# from odoo.osv import expression
# from odoo.exceptions import UserError, ValidationError
from datetime import date


class CustomerFields(models.Model):
    _inherit = "res.partner"
    first_name = fields.Char(string='First Name')
    middle_name = fields.Char(string='Middle Name')
    last_name = fields.Char(string='Last Name')
    age = fields.Integer(string='Age')
    dob = fields.Date(string='DOB')
    Job = fields.Char(string='Job')
    gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ], required=True, default='male')
    national_id = fields.Char(string='National ID')
    name = fields.Char("res.partner.name")

    @api.onchange('last_name', 'first_name', 'middle_name')
    def onchange_compute_name(self):
        if self.last_name and self.middle_name and self.first_name:
            self.name = self.first_name + " " + self.middle_name + " " + self.last_name
            print(self.name)
        elif self.last_name and self.first_name:
            self.name = self.first_name + " " + self.last_name
            print(self.name)
        else:
            print("SAJJAD")

    @api.onchange('dob')
    def onchange_compute_age(self):
        if self.dob:
            today = date.today()
            age = today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))
            self.age=age

