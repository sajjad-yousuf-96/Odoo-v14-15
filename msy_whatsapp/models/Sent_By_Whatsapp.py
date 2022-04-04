from odoo import api, fields, models, tools
# from odoo.osv import expression
# from odoo.exceptions import UserError, ValidationError
import urllib.parse as parse
import re


class SentWhatsapp(models.TransientModel):
    _inherit = "mail.compose.message"

    def sale_whatsapp(self):
        record_phone = self.partner_ids.mobile
        print(record_phone)
        # custom_msg = str(self.body)
        text = re.compile('<.*?>')
        custom_msg = re.sub(text, '', self.body)
        ph_no = [number for number in record_phone if number.isnumeric()]
        ph_no = "".join(ph_no)
        ph_no = "+" + ph_no
        link = "https://web.whatsapp.com/send?phone=" + record_phone
        message_string = parse.quote(custom_msg)

        url_id = link + "&text=" + message_string
        return {
            'type': 'ir.actions.act_url',
            'url': url_id,
            'target': 'new',
            'res_id': self.id,
        }

