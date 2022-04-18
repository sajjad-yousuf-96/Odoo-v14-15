from odoo import models, fields, api, _

import html2text

import urllib.parse as parse


class ContactWhatsappWizard(models.TransientModel):
    _name = 'whatsapp.wizard'
    _description = 'Whatsapp Wizard'

    name = fields.Many2one('res.partner')
    phone = fields.Char(related='name.phone')
    message = fields.Text(string='Message')
    names = fields.Char('res.partner.name')

    def contact_whatsapp(self):
        if self.phone and self.name and self.message:
            print(self.phone)
            link = "https://web.whatsapp.com/send?phone=" + self.phone

            message_string = self.message

            url_id = link + "&text=" + message_string
            return {
                'type': 'ir.actions.act_url',
                'url': url_id,
                'target': 'new',
                'res_id': self.id,
            }

