from odoo import models, fields, api, _

import html2text

import urllib.parse as parse


class SendMessageWhatsapp(models.Model):
    _inherit = 'sale.order'

    def sale_whatsapp(self):
        record_phone = self.partner_id.mobile
        print(record_phone)
        if record_phone:
            return {'type': 'ir.actions.act_window',
                    'name': _('Whatsapp Message'),
                    'res_model': 'whatsapp.wizard',
                    'target': 'new',
                    'view_mode': 'form',
                    'view_type': 'form',
                    }

    def sale_whatsapp_1(self):
        record_phone = self.partner_id.mobile
        print(record_phone)
        if record_phone:
            return {'type': 'ir.actions.act_window',
                    'name': _('Whatsapp Message'),
                    'res_model': 'msy.whatsapp',
                    'target': 'new',
                    'view_mode': 'form',
                    'view_type': 'form',
                    'context': {
                        'default_template_id': self.env.ref('msy_whatsapp.whatsapp_sales_template_1').id},
                    }

    def sale_whatsapp_2(self):
        record_phone = self.partner_id.mobile
        prods = ""
        for rec in self:
            for id in rec.order_line:
                prods = prods + "*" + str(id.product_id.name) + " : " + str(id.product_uom_qty) + "* \n"

        custom_msg = "Hello *{}*, your Sale Order *{}* with amount *{} {}* is ready. \nYour order contains following items: \n{}" \
            .format(str(self.partner_id.name), str(self.name), str(self.currency_id.symbol),
                    str(self.amount_total), prods)
        ph_no = [number for number in record_phone if number.isnumeric()]
        ph_no = "".join(ph_no)
        ph_no = "+" + ph_no

        link = "https://web.whatsapp.com/send?phone=" + ph_no
        message_string = parse.quote(custom_msg)

        url_id = link + "&text=" + message_string
        return {
            'type': 'ir.actions.act_url',
            'url': url_id,
            'target': 'new',
            'res_id': self.id,
        }