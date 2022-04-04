from odoo import models, fields, api

import html2text

import urllib.parse as parse


class SendMessage(models.Model):

    _name = 'msy.whatsapp'
    _description = 'MSY WHATSAPP SYSTEM'

    user_id = fields.Many2one('res.partner', string="Recipient Name")
    mobile_number = fields.Char(related='user_id.mobile', required=True)
    message = fields.Text(string="Message")
    model = fields.Char('mail.template.model_id')
    template_id = fields.Many2one('mail.template', 'Use template', index=True)
    attachments = fields.Binary(string="Attachments")

    @api.onchange('template_id')
    def onchange_template_id_wrapper(self):
        self.ensure_one()
        res_id = self._context.get('active_id') or 1
        values = self.onchange_template_id(self.template_id.id, self.model, res_id)['value']

        for ffname, value in values.items():

            setattr(self, ffname, value)

    def onchange_template_id(self, template_id, model, res_id):
        if template_id:
            values = self.generate_email_for_composer(template_id, [res_id])[res_id]
        else:
            default_values = self.with_context(default_model=model, default_res_id=res_id).default_get(
                ['model', 'res_id', 'partner_ids', 'message'])
            values = dict((key, default_values[key]) for key in
                          ['body', 'partner_ids']
                          if key in default_values)
        values = self._convert_to_write(values)
        return {'value': values}

    def send_custom_message(self):
        if self.message and self.mobile_number:
            message_string = parse.quote(self.message)
            message_string = message_string[:(len(message_string))]
            number = self.user_id.mobile
            link = "https://web.whatsapp.com/send?phone=" + number
            attach = parse.quote(self.attachments)
            send_msg = {
                'type': 'ir.actions.act_url',
                'url': link + "&text=" + message_string + "&source=" + attach,
                'target': 'new',
                'res_id': self.id,
            }
            return send_msg

    def send_direct_message(self):
        record_phone = self.mobile_number
        if record_phone:
            prods = ""
            for rec in self:
                for id in rec.sale.order_line:
                    prods = prods + "*" + str(id.product_id.name) + " : " + str(id.product_uom_qty) + "* \n"

            custom_msg = "Hello *{}*, your Sale Order *{}* with amount *{} {}* is ready. \nYour order contains following items: \n{}"\
                .format(str(self.partner_id.name), str(self.name), str(self.currency_id.symbol), str(self.amount_total),
                        prods)

            ph_no = self.user_id.mobile
            link = "https://web.whatsapp.com/send?phone=" + ph_no
            message_string = parse.quote(custom_msg)

            url_id = link + "&text=" + message_string
            return {
                'type': 'ir.actions.act_url',
                'url': url_id,
                'target': 'new',
                'res_id': self.id,
            }

