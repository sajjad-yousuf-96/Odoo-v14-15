from odoo import models, fields, api, _

import html2text

import urllib.parse as parse


class ContactWhatsappMessages(models.Model):
    _inherit = 'res.partner'

    def contact_whatsapp(self):
        record_phone = self.phone
        print(record_phone)



